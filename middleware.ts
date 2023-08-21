import { NextResponse } from 'next/server';
import { decodeJWTPayload } from '@/lib/utils';
import type { NextRequest } from 'next/server';
import { axios } from './lib/axios';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt');

  if (!token) return redirectToLogin(request);

  const payload = decodeJWTPayload(token.value);
  if (payload.exp < Date.now() / 1000) return redirectToLogin(request);
  // set token to header
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return NextResponse.next();
}

const redirectToLogin = (request: NextRequest) => {
  const redirectUrl = `/login?from=${request.nextUrl.pathname}`;
  return NextResponse.redirect(new URL(redirectUrl, request.url));
};

export const config = {
  matcher: [
    '/overview/:path*',
    '/jobs/:path*',
    '/wallet/:path*',
    '/talents/:path*',
    '/settings/:path*',
    '/messages/:path*',
    '/projects/:path*',
  ],
};
