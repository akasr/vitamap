import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma/prisma';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pharmacyId = url.pathname.split('/').slice(-2, -1)[0];

    const medicines = await prisma.inventory.findMany({
      where: { pharmacyId },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ medicines }, { status: 200 });
  } catch (error) {
    console.error('Fetch medicines error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medicines' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pharmacyId = url.pathname.split('/').slice(-2, -1)[0];
    const { medicineName, batchNumber } = await req.json();

    if (!medicineName || !batchNumber) {
      return NextResponse.json(
        { error: 'Missing medicine identifier' },
        { status: 400 },
      );
    }

    await prisma.inventory.delete({
      where: {
        pharmacyId_medicineName_batchNumber: {
          pharmacyId,
          medicineName,
          batchNumber,
        },
      },
    });

    return NextResponse.json(
      { message: 'Medicine deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Delete medicine error:', error);
    return NextResponse.json(
      { error: 'Failed to delete medicine' },
      { status: 500 },
    );
  }
}
