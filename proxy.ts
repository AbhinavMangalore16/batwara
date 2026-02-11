// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
//   const sessionToken = request.cookies.get('better-auth.session_token');
//   if (request.nextUrl.pathname.startsWith('/dashboard') && !sessionToken) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};