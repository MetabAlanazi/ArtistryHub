import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

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
];

// Protected paths that require authentication
const protectedPaths = [
  '/orders',
  '/wishlist',
  '/profile',
  '/checkout',
];

// Role-based protected paths
const roleProtectedPaths = {
  '/admin': ['admin'],
  '/operator': ['operator'],
  '/artist': ['artist'],
};

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
  
  // Check if path requires specific role
  const requiredRole = Object.entries(roleProtectedPaths).find(([path]) => 
    pathname.startsWith(path)
  )?.[1];

  // Get the token from the request
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // If no token and trying to access protected path, redirect to login
  if (!token) {
    if (isProtectedPath || requiredRole) {
      const loginUrl = new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url);
      return NextResponse.redirect(loginUrl);
    }
    // Allow access to public paths
    return NextResponse.next();
  }

  // If has token, check role boundaries for role-protected paths
  if (requiredRole && token.role) {
    const userRole = token.role as string;
    if (!requiredRole.includes(userRole)) {
      // User doesn't have required role, redirect to appropriate app or show error
      console.log(`Role access denied: ${userRole} trying to access ${pathname}`);
      
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('http://localhost:3001', request.url));
      } else if (userRole === 'artist') {
        return NextResponse.redirect(new URL('http://localhost:3002', request.url));
      } else if (userRole === 'operator') {
        return NextResponse.redirect(new URL('http://localhost:3003', request.url));
      } else {
        // For other roles, redirect to login
        const loginUrl = new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // Check if session is stale
  if (token.mustReauthAt) {
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
