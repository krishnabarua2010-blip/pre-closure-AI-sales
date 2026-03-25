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

// Middleware disabled temporarily to allow localStorage auth flow without SSR loop
// export function middleware(request: NextRequest) {
//   ...
//   return NextResponse.next();
// }

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
