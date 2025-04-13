import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  // Clear the authToken cookie by setting its expiry to the past
  const cookie = serialize('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0), // Set expiry to epoch time (1970-01-01) to invalidate immediately
  });

  console.log('Logging out user, clearing auth token');

  return NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200, headers: { 'Set-Cookie': cookie } },
  );
}
