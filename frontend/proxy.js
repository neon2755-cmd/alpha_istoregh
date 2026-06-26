import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:5000';

export function proxy(request) {
  const url = request.nextUrl;
  
  // Proxy all API requests to the backend
  if (url.pathname.startsWith('/api/')) {
    const backendUrl = new URL(BACKEND_URL);
    const proxyUrl = new URL(url.pathname + url.search, backendUrl);
    
    return NextResponse.rewrite(proxyUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\..*).*)'],
};
