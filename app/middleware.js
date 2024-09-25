// app/_middleware.js

import { NextResponse } from 'next/server';
import { parseCookies } from 'nookies';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const cookies = parseCookies(request);
  const token = cookies.authToken;

  // Allow access to the login and signup pages
  if (pathname === '/login' || pathname === '/signup') {
    return NextResponse.next();
  }

  // Redirect to login if there is no token and the user is not on the login or signup page
  if (!token && pathname !== '/login') {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
