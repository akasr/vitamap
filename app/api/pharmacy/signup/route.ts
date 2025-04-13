import { NextResponse } from 'next/server';
import { prisma } from '@/db/prisma/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const {
      id,
      name,
      phone,
      email,
      username,
      address,
      password,
      latitude,
      longitude,
    } = await req.json();

    // Validate required fields
    if (
      !id ||
      !name ||
      !phone ||
      !email ||
      !username ||
      !address ||
      !password ||
      !latitude ||
      !longitude
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 },
      );
    }

    // Check for uniqueness of ID, phone, email, username
    const [existingById, existingByPhone, existingByEmail, existingByUsername] =
      await Promise.all([
        prisma.pharmacy.findUnique({ where: { id } }),
        prisma.pharmacy.findUnique({ where: { phone } }),
        prisma.pharmacy.findUnique({ where: { email } }),
        prisma.pharmacy.findUnique({ where: { username } }),
      ]);

    if (existingById) {
      return NextResponse.json(
        { error: 'Pharmacy ID already exists' },
        { status: 400 },
      );
    }

    if (existingByPhone) {
      return NextResponse.json(
        { error: 'Phone number already registered' },
        { status: 400 },
      );
    }

    if (existingByEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 },
      );
    }

    if (existingByUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 },
      );
    }

    // Validate location coordinates
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: 'Invalid location coordinates' },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the pharmacy with location in a transaction
    const newPharmacy = await prisma.$transaction(async (prismaClient) => {
      // Create the pharmacy
      const pharmacy = await prismaClient.pharmacy.create({
        data: {
          id,
          name,
          phone,
          email,
          username,
          address,
          password: hashedPassword,
          isOpen: true,
        },
      });

      // Create the location for the pharmacy
      await prismaClient.location.create({
        data: {
          pharmacyId: pharmacy.id,
          latitude: lat,
          longitude: lng,
        },
      });

      return pharmacy;
    });

    return NextResponse.json(
      {
        message: 'Pharmacy registered successfully',
        pharmacyId: newPharmacy.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
