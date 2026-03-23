import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/leads',
  '/advisor',
  '/proposals',
  '/onboarding',
  '/settings',
];

// Routes that are always public
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/product',
  '/pricing',
  '/privacy',
  '/terms',
  '/features',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes and static files through
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/c/') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next();
  }

  // Check if route is protected
  const isProtected = PROTECTED_ROUTES.some(
    route => pathname === route || pathname.startsWith(route + '/')
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const authToken = request.cookies.get('auth_token')?.value;

  if (!authToken) {
    // Redirect to login with return URL
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
