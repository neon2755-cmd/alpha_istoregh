import time
import re
import json
import sys

try:
    import requests
except ImportError:
    print('ERROR: requests missing')
    sys.exit(1)
from html.parser import HTMLParser

URL = 'https://neonio.site'
TIMEOUT = 30

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.scripts = []
        self.links = []
        self.images = []
        self.styles = []
        self.meta = []
        self.inline_scripts = 0
        self.inline_styles = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'script':
            src = attrs.get('src')
            if src:
                self.scripts.append(src)
            else:
                self.inline_scripts += 1
        elif tag == 'link':
            rel = attrs.get('rel', '').lower()
            href = attrs.get('href')
            if href and rel:
                if 'stylesheet' in rel:
                    self.styles.append(href)
                self.links.append((rel, href))
        elif tag == 'img':
            src = attrs.get('src') or attrs.get('data-src')
            if src:
                self.images.append(src)
        elif tag == 'meta':
            self.meta.append(attrs)


def norm_url(u):
    if not u:
        return None
    if u.startswith('http://') or u.startswith('https://'):
        return u
    if u.startswith('//'):
        return 'https:' + u
    if u.startswith('/'):
        return URL.rstrip('/') + u
    if u.startswith('data:'):
        return None
    return URL.rstrip('/') + '/' + u.lstrip('./')


def safe_request(session, url, typ):
    now = time.perf_counter()
    try:
        r = session.get(url, timeout=TIMEOUT, stream=True)
        content = r.content if typ in ('script', 'style', 'image') else b''
        size = len(content) if content else int(r.headers.get('content-length') or 0)
        elapsed = time.perf_counter() - now
        return {
            'type': typ,
            'url': url,
            'status': r.status_code,
            'content_type': r.headers.get('content-type', ''),
            'content_encoding': r.headers.get('content-encoding', ''),
            'cache_control': r.headers.get('cache-control', ''),
            'age': r.headers.get('age', ''),
            'server': r.headers.get('server', ''),
            'via': r.headers.get('via', ''),
            'content_length': size,
            'elapsed': elapsed,
            'cdn': r.headers.get('x-amz-cf-id') or r.headers.get('x-cache') or r.headers.get('cf-cache-status') or r.headers.get('via') or r.headers.get('server', ''),
        }
    except Exception as e:
        return {'type': typ, 'url': url, 'error': str(e)}


def main():
    print('FETCH PAGE', URL)
    session = requests.Session()
    start = time.perf_counter()
    response = session.get(URL, timeout=TIMEOUT)
    page_time = time.perf_counter() - start
    print(json.dumps({
        'status_code': response.status_code,
        'final_url': response.url,
        'content_length': len(response.content),
        'elapsed': response.elapsed.total_seconds(),
        'page_time': page_time,
        'headers': {k: v for k, v in response.headers.items() if k.lower() in ['content-type', 'content-encoding', 'cache-control', 'age', 'server', 'via', 'x-cache', 'cf-cache-status']},
    }, indent=2))

    parser = PageParser()
    parser.feed(response.text)

    resources = []
    for src in parser.scripts:
        nu = norm_url(src)
        if nu:
            resources.append(('script', src, nu))
    for href in parser.styles:
        nu = norm_url(href)
        if nu:
            resources.append(('style', href, nu))
    for rel, href in parser.links:
        nu = norm_url(href)
        if nu and rel not in ['dns-prefetch', 'preconnect']:
            resources.append((rel, href, nu))
    for src in parser.images:
        nu = norm_url(src)
        if nu:
            resources.append(('image', src, nu))

    seen = set()
    uniq = []
    for typ, src, nu in resources:
        if nu not in seen:
            seen.add(nu)
            uniq.append((typ, src, nu))
    resources = uniq
    print('RESOURCE_COUNTS', len(resources), 'scripts', len(parser.scripts), 'styles', len(parser.styles), 'images', len(parser.images))

    data = []
    for typ, src, nu in resources[:60]:
        result = safe_request(session, nu, typ)
        result['src'] = src
        data.append(result)
    print(json.dumps({'resources': data}, indent=2))

    apis = ['/api/products/homefeed', '/api/settings', '/api/orders/dashboard-stats', '/api/contact', '/api/auth/me']
    api_results = []
    for path in apis:
        u = URL.rstrip('/') + path
        t0 = time.perf_counter()
        try:
            r = session.get(u, timeout=TIMEOUT)
            api_results.append({
                'path': path,
                'url': u,
                'status': r.status_code,
                'elapsed': time.perf_counter() - t0,
                'content_type': r.headers.get('content-type', ''),
                'cache_control': r.headers.get('cache-control', ''),
                'age': r.headers.get('age', ''),
                'content_length': len(r.content),
                'json_keys': list(r.json().keys()) if 'application/json' in r.headers.get('content-type', '') else None,
            })
        except Exception as e:
            api_results.append({'path': path, 'url': u, 'error': str(e)})
    print(json.dumps({'api_results': api_results}, indent=2))

    third_party = []
    for typ, src, nu in resources:
        host = re.sub(r'^https?://', '', nu).split('/')[0].split(':')[0]
        if host and host not in ['neonio.site', 'www.neonio.site']:
            third_party.append({'type': typ, 'src': src, 'url': nu, 'host': host})
    print(json.dumps({'third_party': third_party}, indent=2))

    for strategy in ['mobile', 'desktop']:
        try:
            psi_url = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
            params = {'url': URL, 'strategy': strategy, 'category': ['performance', 'accessibility']}
            r = requests.get(psi_url, params=params, timeout=TIMEOUT)
            if r.status_code == 200:
                j = r.json()
                audits = j.get('lighthouseResult', {}).get('audits', {})
                metrics = {}
                for key in ['first-contentful-paint', 'largest-contentful-paint', 'cumulative-layout-shift', 'interactive', 'speed-index', 'total-blocking-time', 'time-to-first-byte']:
                    if key in audits:
                        metrics[key] = {
                            'score': audits[key].get('score'),
                            'displayValue': audits[key].get('displayValue'),
                            'numericValue': audits[key].get('numericValue'),
                        }
                metrics['origin_fallback'] = j.get('lighthouseResult', {}).get('originFallback', False)
                print('PAGESPEED', strategy, json.dumps(metrics))
            else:
                print('PAGESPEED_ERROR', strategy, r.status_code, r.text[:500])
        except Exception as e:
            print('PAGESPEED_EXCEPTION', strategy, str(e))

if __name__ == '__main__':
    main()
