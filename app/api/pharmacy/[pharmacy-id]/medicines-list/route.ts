import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { 'pharmacy-id': string } }
) {
  try {
    const pharmacyId = params['pharmacy-id'];

    const medicines = await prisma.inventory.findMany({
      where: { pharmacyId },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ medicines }, { status: 200 });
  } catch (error) {
    console.error('Fetch medicines error:', error);
    return NextResponse.json({ error: 'Failed to fetch medicines' }, { status: 500 });
  }
}
