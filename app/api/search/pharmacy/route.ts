import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const toRad = (val: number) => (val * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.toLowerCase();
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');

  if (!query || isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: 'Query, lat and lng are required' },
      { status: 400 },
    );
  }

  const inventories = await prisma.inventory.findMany({
    where: {
      medicine: {
        contains: query,
        mode: 'insensitive',
      },
      stock: {
        gt: 0,
      },
    },
    include: {
      pharmacy: {
        include: {
          location: true,
        },
      },
    },
  });

  const result = inventories
    .map((inv) => {
      const { lat: plat, lng: plng } = inv.pharmacy.location;
      const distance = haversineDistance(lat, lng, plat, plng);
      return {
        pharmacyId: inv.pharmacy.id,
        name: inv.pharmacy.name,
        username: inv.pharmacy.username,
        medicine: inv.medicine,
        price: inv.price,
        stock: inv.stock,
        distance,
        location: {
          lat: plat,
          lng: plng,
        },
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 20); // limit results

  return NextResponse.json({ results: result });
}
