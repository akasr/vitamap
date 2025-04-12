import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: { 'pharmacy-id': string } }
) {
  try {
    const pharmacyId = params['pharmacy-id'];
    const { medicineName, batchNumber, expiryDate, quantity, pricePerUnit } = await req.json();

    if (!medicineName || !batchNumber || !expiryDate || quantity == null || pricePerUnit == null) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await prisma.inventory.update({
      where: {
        pharmacyId_medicineName_batchNumber: {
          pharmacyId,
          medicineName,
          batchNumber,
        },
      },
      data: {
        expiryDate: new Date(expiryDate),
        quantity,
        pricePerUnit,
      },
    });

    return NextResponse.json({ message: 'Medicine updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update medicine' }, { status: 500 });
  }
}
