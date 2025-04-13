import { NextResponse } from 'next/server';
import { prisma } from '@/db/index';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  console.log(`Medicine search query: "${query}"`);

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    console.log('Executing database query for medicine search');
    const results = await prisma.inventory.findMany({
      where: {
        medicineName: {
          contains: query,
          mode: 'insensitive',
        },
      },
      include: {
        pharmacy: true,
      },
    });

    console.log(`Search results found: ${results.length}`);
    if (results.length === 0) {
      console.log(
        'No results found. Checking database for any inventory items...',
      );
      const totalItems = await prisma.inventory.count();
      console.log(`Total inventory items in database: ${totalItems}`);
    }

    return NextResponse.json(results);
  } catch (err) {
    console.error('Database query error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
