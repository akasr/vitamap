import { SignJWT } from 'jose';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';
import { prisma } from '@/db/prisma/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 },
      );
    }

    const pharmacy = await prisma.pharmacy.findUnique({
      where: { username },
    });

    if (!pharmacy) {
      return NextResponse.json(
        { error: 'Pharmacy not found' },
        { status: 404 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, pharmacy.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Convert secret to Uint8Array for jose
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_for_development',
    );

    // Generate JWT with jose
    const token = await new SignJWT({ pharmacyId: pharmacy.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secretKey);

    // Set cookie
    const cookie = serialize('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 86400, // 24 hours
    });

    console.log('Login successful for:', pharmacy.id);
    console.log(
      'Token generated (first 10 chars):',
      token.substring(0, 10) + '...',
    );

    return NextResponse.json(
      { message: 'Login successful', pharmacyId: pharmacy.id },
      { status: 200, headers: { 'Set-Cookie': cookie } },
    );
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
