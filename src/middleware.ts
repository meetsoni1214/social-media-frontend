import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/register',
  '/dashboard',
  '/business-profile',
  '/social-profiles',
];

const authRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSessionCookie = request.cookies.has('sFrontToken');

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !hasSessionCookie) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && hasSessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)'],
};
