const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const category = await prisma.laboratoryCategory.findFirst({ where: { deletedAt: null } });
  const test = await prisma.laboratoryTest.findFirst({ where: { deletedAt: null } });
  console.log(JSON.stringify({
    categoryId: category?.id,
    testId: test?.id,
    categoryName: category?.name,
    testName: test?.name,
  }, null, 2));
  await prisma.$disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
