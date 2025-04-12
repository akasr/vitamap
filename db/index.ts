
import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

const main = async () => {
  try {
    /* INSERT SINGLE DATA */
    const user = await prisma.pharmacy.create({
      data: {
        id: "1",
        name: "Avinash",
        phone: "1234567890",
        email: "user@gmail.com",
        username: "user",
  address:"INDIA",
//   isOpen:,
  password :"password",
  inventory:{}
//   location    Location?
        // age: 100,

      },
    });
    console.log("Inserted user:", user);
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await prisma.$disconnect();
  }
};

main();
