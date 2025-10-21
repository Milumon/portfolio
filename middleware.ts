import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect the admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // For now, we'll let the client-side authentication handle the protection
    // In a production app, you'd verify the Firebase token server-side
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};