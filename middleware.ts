import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Define a comprehensive Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://*.google.com https://*.googleapis.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https://*.googleusercontent.com https://res.cloudinary.com;
    connect-src 'self' https://accounts.google.com https://*.google.com https://*.googleapis.com;
    frame-src 'self' https://accounts.google.com https://*.google.com;
    worker-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim(); // Clean up whitespace

  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: [
    /*
     * Apply CSP to all routes that might interact with Google OAuth or load external resources.
     * This list can be adjusted if specific routes need different policies.
     */
    '/',
    '/auth',
    '/signup',
    '/post-auth-landing',
    '/dashboard',
    '/templates',
    '/resume-builder',
    '/preview-download',
    '/optimize',
  ],
};