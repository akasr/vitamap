
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

async function main() {
  const filePath = path.join(__dirname, "pharmacy_data.json");
  const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const { pharmacies, locations, inventory } = jsonData;

  // Seed pharmacies
  for (const pharmacy of pharmacies) {
    try {
      await prisma.pharmacy.create({
        data: pharmacy,
      });
      console.log(`Inserted pharmacy: ${pharmacy.name}`);
    } catch (error) {
      console.error(`❌ Error inserting pharmacy ${pharmacy.name}:`, error);
    }
  }

  // Seed locations
  for (const location of locations) {
    try {
      await prisma.location.create({
        data: location,
      });
      console.log(`Inserted location for pharmacy: ${location.pharmacyId}`);
    } catch (error) {
      console.error(`❌ Error inserting location for pharmacy ${location.pharmacyId}:`, error);
    }
  }

  // Seed inventory
  for (const item of inventory) {
    try {
      await prisma.inventory.create({
        data: {
          ...item,
          expiryDate: new Date(item.expiryDate),
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        },
      });
      console.log(`Inserted inventory item: ${item.medicineName} (${item.pharmacyId})`);
    } catch (error) {
      console.error(`❌ Error inserting inventory for ${item.medicineName} (${item.pharmacyId}):`, error);
    }
  }
}

main()
  .catch((e) => console.error("🔥 Main Error:", e))
  .finally(async () => {
    await prisma.$disconnect();
  });
