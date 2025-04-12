
// import { PrismaClient } from "./generated/prisma";

// const prisma = new PrismaClient();

// const main = async () => {
//   try {
//     /* INSERT SINGLE DATA */
//     const user = await prisma.pharmacy.create({
//       data: {
//         id: "1",
//         name: "Avinash",
//         phone: "1234567890",
//         email: "user@gmail.com",
//         username: "user",
//   address:"INDIA",
// //   isOpen:,
//   password :"password",
//   inventory:{}
// //   location    Location?
//         // age: 100,

//       },
//     });
//     console.log("Inserted user:", user);
//   } catch (error) {
//     console.error("Error occurred:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// main();
import { PrismaClient } from "./generated/prisma";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// async function main() {
//   const filePath = path.join(__dirname, "pharmacy_data.json");
//   const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

//   const { pharmacies, locations, inventory } = jsonData;

//   // Seed pharmacies
//   for (const pharmacy of pharmacies) {
//     try {
//       await prisma.pharmacy.create({
//         data: pharmacy,
//       });
//       console.log(`Inserted pharmacy: ${pharmacy.name}`);
//     } catch (error) {
//       console.error(`❌ Error inserting pharmacy ${pharmacy.name}:`, error);
//     }
//   }

//   // Seed locations
//   for (const location of locations) {
//     try {
//       await prisma.location.create({
//         data: location,
//       });
//       console.log(`Inserted location for pharmacy: ${location.pharmacyId}`);
//     } catch (error) {
//       console.error(`❌ Error inserting location for pharmacy ${location.pharmacyId}:`, error);
//     }
//   }

//   // Seed inventory
//   for (const item of inventory) {
//     try {
//       await prisma.inventory.create({
//         data: {
//           ...item,
//           expiryDate: new Date(item.expiryDate),
//           createdAt: new Date(item.createdAt),
//           updatedAt: new Date(item.updatedAt),
//         },
//       });
//       console.log(`Inserted inventory item: ${item.medicineName} (${item.pharmacyId})`);
//     } catch (error) {
//       console.error(`❌ Error inserting inventory for ${item.medicineName} (${item.pharmacyId}):`, error);
//     }
//   }
// }

// main()
//   .catch((e) => console.error("🔥 Main Error:", e))
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

async function main() {
  const idsToDelete = ['1', '123', '12345'];

  // Delete related inventory
  await prisma.inventory.deleteMany({
    where: {
      pharmacyId: { in: idsToDelete },
    },
  });

  // Delete related locations
  await prisma.location.deleteMany({
    where: {
      pharmacyId: { in: idsToDelete },
    },
  });

  // Delete related med requests
  await prisma.medReq.deleteMany({
    where: {
      pharmacyId: { in: idsToDelete },
    },
  });

  // Now delete pharmacies
  const deleted = await prisma.pharmacy.deleteMany({
    where: {
      id: { in: idsToDelete },
    },
  });

  console.log(`✅ Deleted ${deleted.count} pharmacy records and their related data`);
}

main()
  .catch((e) => {
    console.error('❌ Error deleting data:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });