// import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from '@/databaseVitamap/generated/prisma';
import { PrismaClient } from '../generated/prisma';



declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize PrismaClient with error handling
const initPrismaClient = () => {
  try {
    const client = new PrismaClient({
      log: ['error', 'warn'],
      errorFormat: 'pretty',
    });
    // Test the connection
    return client.$connect().then(() => client);
  } catch (error) {
    console.error('Failed to initialize Prisma Client:', error);
    process.exit(1);
  }
};

// Ensure single instance
if (!global.prisma) {
  global.prisma = await initPrismaClient();
}

export const prisma = global.prisma;

// Cleanup
process.on('beforeExit', async () => {
  await prisma?.$disconnect();
});