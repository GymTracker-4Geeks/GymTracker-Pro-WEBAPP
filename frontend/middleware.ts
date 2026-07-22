import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname.startsWith('/auth/reset-password')) {
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/auth/reset-password/error?reason=missing', request.url));
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/api/auth/reset-password?token=${token}`, {
        method: 'GET',
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL('/auth/reset-password/error?reason=invalid', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/reset-password/error?reason=server_error', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/auth/reset-password',
};
