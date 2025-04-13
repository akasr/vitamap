import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma/prisma';

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pharmacyId = url.pathname.split('/').slice(-2, -1)[0];

    const body = await req.json();
    const {
      medicineId,
      medicineName,
      batchNumber,
      manufacturedDate,
      expiryDate,
      quantity,
      pricePerUnit,
    } = body;

    if (
      !medicineId ||
      !pharmacyId ||
      !medicineName ||
      !batchNumber ||
      !manufacturedDate ||
      !expiryDate ||
      quantity == null ||
      pricePerUnit == null
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const newInventory = await prisma.inventory.create({
      data: {
        medicineName,
        batchNumber,
        expiryDate: new Date(expiryDate),
        quantity: Number(quantity),
        pricePerUnit: parseFloat(pricePerUnit),
        pharmacyId,
      },
    });

    return NextResponse.json(newInventory, { status: 201 });
  } catch (error) {
    console.error('Failed to add inventory item:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
