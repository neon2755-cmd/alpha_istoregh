import requests

urls = [
    'https://neonio.site/api/products/homefeed',
    'https://neonio.site/api/settings',
    'https://neonio.site/api/orders/dashboard-stats',
    'https://neonio.site/api/contact',
    'https://neonio.site/api/auth/me',
]

for u in urls:
    try:
        r = requests.get(u, timeout=20)
        print(u)
        print('status', r.status_code)
        print('type', r.headers.get('content-type'))
        print('cache', r.headers.get('cache-control'))
        print('elapsed', r.elapsed.total_seconds())
        print('body', r.text)
    except Exception as e:
        print(u, 'error', type(e).__name__, str(e))
    print('---')
