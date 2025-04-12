import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma/prisma'; // Adjust path as needed
//import { v4 as uuidv4 } from 'uuid';

export async function POST(
  req: NextRequest,
  { params }: { params: { pharmacy: string } }
) {
  try {
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

    const pharmacyId = params.pharmacy;
    //const medicineId = uuidv4(); // ✅ generate unique ID for both tables

    // Validate required fields
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
        { status: 400 }
      );
    }

    // Use a transaction to ensure both records are created together
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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
