const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting MedSecure QR database seeding...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@medsecure.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  // 1. Upsert Admin User
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
    create: {
      name: 'System Administrator',
      email: adminEmail,
      mobile: '+1-555-019-2831',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      dateOfBirth: '1985-04-12',
      gender: 'Male',
      isActive: true,
    },
  });
  console.log(`✅ Admin account initialized: ${admin.email}`);

  // 2. Demo Patient 1: John Doe
  const user1PasswordHash = await bcrypt.hash('Patient@123456', 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      name: 'Johnathan Edward Doe',
      email: 'john.doe@example.com',
      mobile: '+1-555-987-6543',
      passwordHash: user1PasswordHash,
      role: 'USER',
      dateOfBirth: '1990-08-15',
      gender: 'Male',
      isActive: true,
    },
  });

  const profile1 = await prisma.medicalProfile.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      bloodGroup: 'O+',
      rhFactor: 'Positive',
      address: '742 Evergreen Terrace, Springfield, OR 97477',
      allergies: 'Penicillin (Severe anaphylaxis), Peanut allergy',
      medicalConditions: 'Type 1 Diabetes Mellitus, Mild Asthma',
      chronicDiseases: 'Asthma',
      previousSurgeries: 'Appendectomy (2018), Right Knee Arthroscopy (2021)',
      currentMedications: 'Insulin Glargine 20 units SC daily, Albuterol Inhaler PRN',
      previousMedications: 'Metformin 500mg',
      disabilityInfo: 'None',
      emergencyContactName: 'Sarah Doe',
      emergencyContactNumber: '+1-555-987-6544',
      emergencyContactRelationship: 'Spouse',
      preferredHospital: 'Springfield Memorial Hospital (Level 1 Trauma)',
      primaryDoctor: 'Dr. Robert Marcus, MD',
      doctorContact: '+1-555-321-7890',
      height: '180 cm',
      weight: '78 kg',
      smokingStatus: 'Non-Smoker',
      alcoholStatus: 'Occasional (Social)',
      organDonorStatus: 'Yes (Registered Donor)',
      insuranceProvider: 'BlueCross BlueShield',
      insurancePolicyNumber: 'BCBS-982173491-01',
      additionalNotes: 'Patient carries emergency glucagon pen in backpack.',
    },
  });

  const token1 = 'token_demo_john_doe_99812';
  const qr1 = await prisma.qRProfile.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      secureToken: token1,
      isActive: true,
    },
  });

  await prisma.consent.create({
    data: {
      userId: user1.id,
      consentType: 'EMERGENCY_QR_SHARING',
      accepted: true,
    },
  });

  // Access Log for John Doe
  await prisma.accessLog.create({
    data: {
      qrProfileId: qr1.id,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) Mobile/15E148 Safari/604.1',
      accessType: 'QR_SCAN',
      ipAddress: '192.168.1.45',
      metadata: JSON.stringify({ device: 'Mobile Safari', location: 'Emergency Response Access' }),
    },
  });

  console.log(`✅ Demo Patient 1 initialized: ${user1.email} (QR Token: ${qr1.secureToken})`);

  // 3. Demo Patient 2: Jane Smith
  const user2PasswordHash = await bcrypt.hash('Patient@123456', 10);
  const user2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      name: 'Jane Marie Smith',
      email: 'jane.smith@example.com',
      mobile: '+1-555-456-7890',
      passwordHash: user2PasswordHash,
      role: 'USER',
      dateOfBirth: '1995-11-23',
      gender: 'Female',
      isActive: true,
    },
  });

  const profile2 = await prisma.medicalProfile.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      userId: user2.id,
      bloodGroup: 'AB-',
      rhFactor: 'Negative',
      address: '104 Beacon St, Boston, MA 02116',
      allergies: 'Latex, Sulfa Drugs',
      medicalConditions: 'Hypertension',
      chronicDiseases: 'Essential Hypertension',
      previousSurgeries: 'Wisdom Teeth Extraction (2019)',
      currentMedications: 'Lisinopril 10mg daily',
      previousMedications: 'None',
      disabilityInfo: 'None',
      emergencyContactName: 'Michael Smith',
      emergencyContactNumber: '+1-555-456-7891',
      emergencyContactRelationship: 'Brother',
      preferredHospital: 'Massachusetts General Hospital',
      primaryDoctor: 'Dr. Helen Vance, MD',
      doctorContact: '+1-555-654-3210',
      height: '165 cm',
      weight: '62 kg',
      smokingStatus: 'Non-Smoker',
      alcoholStatus: 'No',
      organDonorStatus: 'Yes',
      insuranceProvider: 'Aetna Health',
      insurancePolicyNumber: 'AET-77889921',
      additionalNotes: 'Requires latex-free medical equipment.',
    },
  });

  const token2 = 'token_demo_jane_smith_44312';
  const qr2 = await prisma.qRProfile.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      userId: user2.id,
      secureToken: token2,
      isActive: true,
    },
  });

  await prisma.consent.create({
    data: {
      userId: user2.id,
      consentType: 'EMERGENCY_QR_SHARING',
      accepted: true,
    },
  });

  console.log(`✅ Demo Patient 2 initialized: ${user2.email} (QR Token: ${qr2.secureToken})`);
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
