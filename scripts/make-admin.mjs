import "dotenv/config";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  const email = "gamzkenny@gmail.com";

  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      role: "ADMIN",
    },
  });

  console.log(`Successfully made ${user.email} an ADMIN`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
