const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const patient = await prisma.patient.findFirst({ where: { deletedAt: null, isActive: true }, include: { user: true } });
  const doctor = await prisma.staff.findFirst({ where: { deletedAt: null, isActive: true }, include: { user: true } });
  const appointment = await prisma.appointment.findFirst({ where: { deletedAt: null } });
  const medical = await prisma.medicalRecord.findFirst({ where: { deletedAt: null } });
  const category = await prisma.laboratoryCategory.findFirst({ where: { deletedAt: null } });
  const test = await prisma.laboratoryTest.findFirst({ where: { deletedAt: null } });
  console.log(JSON.stringify({
    patientId: patient?.id,
    doctorId: doctor?.id,
    appointmentId: appointment?.id,
    medicalRecordId: medical?.id,
    categoryId: category?.id,
    testId: test?.id,
    patientName: patient ? `${patient.user?.firstName} ${patient.user?.lastName}` : null,
    doctorName: doctor ? `${doctor.user?.firstName} ${doctor.user?.lastName}` : null,
  }, null, 2));
  await prisma.$disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
