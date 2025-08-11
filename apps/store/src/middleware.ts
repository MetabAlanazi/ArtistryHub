import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { SessionManager } from '@artistry-hub/auth';
// import type { UserRole } from '@artistry-hub/auth';

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/api/auth',
  '/api/test-auth',
  '/api/test-nextauth',
  '/api/test-user',
  '/api/test-db',
  '/api/placeholder',
  '/store',
  '/products',
  '/categories',
];

// Protected paths that require authentication
const protectedPaths = [
  '/orders',
  '/wishlist',
  '/profile',
  '/checkout',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Check if path is public
  const isPublicPath = publicPaths.some(path => pathname === path);
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  // Get the token from the request
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // If no token and trying to access protected path, redirect to login
  if (!token) {
    if (isProtectedPath) {
      const loginUrl = new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url);
      return NextResponse.redirect(loginUrl);
    }
    // Allow access to public paths
    return NextResponse.next();
  }

  // TODO: Re-enable session management after fixing import issues
  // If user is authenticated, check if they should be redirected to their primary app
  // if (token.role) {
  //   const userRole = token.role as UserRole;
  //   const redirectCheck = SessionManager.shouldRedirect(userRole, 'store');
  //   
  //   if (redirectCheck.shouldRedirect && redirectCheck.redirectUrl) {
  //     console.log(`🔄 Redirecting ${userRole} user to primary app: ${redirectCheck.redirectUrl}`);
  //     
  //     // Add the current path as a callback URL if it's a protected path
  //     let redirectUrl = redirectCheck.redirectUrl;
  //     if (isProtectedPath) {
  //       redirectUrl += pathname;
  //     }
  //     
  //     return NextResponse.redirect(new URL(redirectUrl));
  //   }
  // }

  // Check if session is stale
  if (token.mustReauthAt && typeof token.mustReauthAt === 'string') {
    const reauthTime = new Date(token.mustReauthAt).getTime();
    const now = Date.now();
    
    if (now >= reauthTime) {
      // Session is stale, redirect to login
      const loginUrl = new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
