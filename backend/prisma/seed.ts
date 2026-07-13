import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // ─── Seed Super Admin ──────────────────────────────────────────────────────
  const adminEmail = "admin@hospital.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("Admin@123", 12);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: "Super",
        lastName: "Admin",
        role: "SUPER_ADMIN",
        phone: "+1-555-0100",
      },
    });
    console.log(`✅ Created Super Admin: ${admin.email} (id: ${admin.id})`);
  } else {
    console.log(`ℹ️  Super Admin already exists: ${adminEmail}`);
  }

  // ─── Seed Departments ──────────────────────────────────────────────────────
  const departments = [
    { name: "General Medicine", description: "Primary care and general health services" },
    { name: "Cardiology", description: "Heart and cardiovascular system" },
    { name: "Neurology", description: "Brain, spinal cord, and nervous system" },
    { name: "Orthopedics", description: "Bones, joints, and musculoskeletal system" },
    { name: "Pediatrics", description: "Medical care for infants, children, and adolescents" },
    { name: "Obstetrics & Gynecology", description: "Women's reproductive health" },
    { name: "Emergency", description: "Critical and emergency care" },
    { name: "Laboratory", description: "Diagnostic and pathology services" },
    { name: "Pharmacy", description: "Medication dispensing and management" },
    { name: "Radiology", description: "Medical imaging and diagnostics" },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: dept,
    });
  }
  console.log(`✅ Seeded ${departments.length} departments`);

  // ─── Seed a sample Doctor ──────────────────────────────────────────────────
  const doctorEmail = "dr.smith@hospital.com";
  const existingDoctor = await prisma.user.findUnique({ where: { email: doctorEmail } });

  if (!existingDoctor) {
    const hashedPassword = await bcrypt.hash("Doctor@123", 12);
    const cardiology = await prisma.department.findUnique({
      where: { name: "Cardiology" },
    });

    const doctorUser = await prisma.user.create({
      data: {
        email: doctorEmail,
        password: hashedPassword,
        firstName: "John",
        lastName: "Smith",
        role: "DOCTOR",
        phone: "+1-555-0200",
      },
    });

    await prisma.staff.create({
      data: {
        userId: doctorUser.id,
        departmentId: cardiology?.id,
        specialization: "Cardiologist",
        licenseNumber: "MED-2024-001",
        bio: "Dr. John Smith is a board-certified cardiologist with 15 years of experience.",
      },
    });
    console.log(`✅ Created sample Doctor: ${doctorEmail}`);
  } else {
    console.log(`ℹ️  Sample Doctor already exists: ${doctorEmail}`);
  }

  console.log("\n✅ Seeding completed successfully!");
  console.log("\n📋 Login Credentials:");
  console.log("  Super Admin → admin@hospital.com / Admin@123");
  console.log("  Doctor      → dr.smith@hospital.com / Doctor@123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
