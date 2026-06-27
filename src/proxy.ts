import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;

  const { pathname } = request.nextUrl;
  
  // Define protected routes
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isStudentOnboarding = pathname.startsWith('/register/student/student-onboarding');
  const isMentorOnboarding = pathname.startsWith('/register/mentor/onboarding');

  // If it's a protected route and user is not authenticated
  if ((isDashboardRoute || isStudentOnboarding || isMentorOnboarding) && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/register/student/student-onboarding/:path*',
    '/register/mentor/onboarding/:path*',
  ],
};
