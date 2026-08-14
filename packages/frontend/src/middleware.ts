import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value || request.headers.get('authorization')?.split(' ')[1];
  // We store token in localStorage, but middleware can't read localStorage.
  // Alternative: store in httpOnly cookie from backend. For now, we'll protect client-side.
  // We'll rely on client-side checks.
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};