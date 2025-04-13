import { NextResponse } from 'next/server';
import * as jose from 'jose';

// Helper function to parse cookies
function parseCookies(cookieHeader: string | null) {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach((cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
}

export async function middleware(req: Request) {
  const cookieHeader = req.headers.get('cookie');
  const cookies = parseCookies(cookieHeader);
  const token = cookies.authToken;

  console.log(
    'Middleware: Token:',
    token ? `${token.substring(0, 10)}...` : null,
  ); // Debugging (only show part of token for security)
  console.log('Middleware: Requested URL:', req.url); // Debugging

  // Allow access to /pharmacy/signin and /pharmacy/signup without authentication
  const publicRoutes = ['/pharmacy/signin', '/pharmacy/signup'];
  if (publicRoutes.some((route) => req.url.includes(route))) {
    console.log('Middleware: Public route, allowing access');
    return NextResponse.next();
  }

  // Check for JWT token
  if (!token) {
    console.log('Middleware: No token, redirecting to /pharmacy/signin');
    return NextResponse.redirect(new URL('/pharmacy/signin', req.url)); // Redirect to login if no token
  }

  try {
    // Convert secret to Uint8Array for jose
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_for_development',
    );

    // Verify JWT token with jose
    const { payload } = await jose.jwtVerify(token, secretKey);
    console.log('Middleware: Token verified, payload:', payload); // Show decoded payload
    return NextResponse.next(); // Allow the request to proceed
  } catch (error) {
    console.error('Middleware: Token verification error:', error); // Log the specific error
    return NextResponse.redirect(new URL('/pharmacy/signin', req.url)); // Redirect if token is invalid
  }
}

export const config = {
  matcher: ['/pharmacy/:path*'], // Apply middleware to all /pharmacy routes
};
