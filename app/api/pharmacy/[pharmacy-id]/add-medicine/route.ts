import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma/prisma';

export async function POST(req: NextRequest, { params }: { params: { 'pharmacy-id': string } }) {
  try {
    const pharmacyId = (await params)['pharmacy-id'];
    const { medicineName, batchNumber, expiryDate, quantity, pricePerUnit } = await req.json();

    if (!medicineName || !batchNumber || !expiryDate || quantity == null || pricePerUnit == null) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Optionally check if pharmacy exists
    const pharmacy = await prisma.pharmacy.findUnique({ where: { id: pharmacyId } });
    if (!pharmacy) {
      return NextResponse.json({ error: 'Pharmacy not found' }, { status: 404 });
    }

    const newMedicine = await prisma.inventory.create({
      data: {
        medicineName,
        batchNumber,
        expiryDate: new Date(expiryDate),
        quantity,
        pricePerUnit,
        pharmacyId,
      },
    });

    return NextResponse.json({ message: 'Medicine added successfully', id: newMedicine.medicineName });
  } catch (error) {
    console.error('Add Medicine Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
