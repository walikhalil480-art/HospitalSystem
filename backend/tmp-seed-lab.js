const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const category = await prisma.laboratoryCategory.upsert({
    where: { name: 'Clinical Chemistry' },
    update: {},
    create: { name: 'Clinical Chemistry', description: 'Routine chemistry and biomarker tests' },
  });

  const test = await prisma.laboratoryTest.upsert({
    where: { name: 'Lipid Panel' },
    update: {},
    create: {
      name: 'Lipid Panel',
      laboratoryCategoryId: category.id,
      description: 'Standard lipid profile',
      referenceRange: 'Desirable range based on clinical protocol',
    },
  });

  console.log(JSON.stringify({ categoryId: category.id, testId: test.id }, null, 2));
  await prisma.$disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
