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

  // 4. Demo Patient 3: Carlos Rodriguez (O- Universal Donor)
  const user3PasswordHash = await bcrypt.hash('Patient@123456', 10);
  const user3 = await prisma.user.upsert({
    where: { email: 'carlos.rodriguez@example.com' },
    update: {},
    create: {
      name: 'Carlos Alberto Rodriguez',
      email: 'carlos.rodriguez@example.com',
      mobile: '+1-555-234-5678',
      passwordHash: user3PasswordHash,
      role: 'USER',
      dateOfBirth: '1982-06-14',
      gender: 'Male',
      isActive: true,
    },
  });

  const profile3 = await prisma.medicalProfile.upsert({
    where: { userId: user3.id },
    update: {},
    create: {
      userId: user3.id,
      bloodGroup: 'O-',
      rhFactor: 'Negative',
      address: '89 Mission St, San Francisco, CA 94105',
      allergies: 'Peanut allergy, Tree nuts (Anaphylactic risk)',
      medicalConditions: 'Mild Asthma, Seasonal Allergies',
      chronicDiseases: 'Asthma',
      previousSurgeries: 'Hernia Repair (2016)',
      currentMedications: 'Albuterol HFA, Cetirizine 10mg',
      previousMedications: 'None',
      disabilityInfo: 'None',
      emergencyContactName: 'Maria Rodriguez',
      emergencyContactNumber: '+1-555-234-5679',
      emergencyContactRelationship: 'Spouse',
      preferredHospital: 'UCSF Medical Center',
      primaryDoctor: 'Dr. Gregory House, MD',
      doctorContact: '+1-555-876-5432',
      height: '175 cm',
      weight: '74 kg',
      smokingStatus: 'Non-Smoker',
      alcoholStatus: 'Occasional (Social)',
      organDonorStatus: 'Yes',
      insuranceProvider: 'BlueCross BlueShield',
      insurancePolicyNumber: 'BCBS-11223344',
      additionalNotes: 'Universal Blood Donor (O Negative). Carries Epinephrine Auto-Injector.',
    },
  });

  const qr3 = await prisma.qRProfile.upsert({
    where: { userId: user3.id },
    update: {},
    create: {
      userId: user3.id,
      secureToken: 'token_demo_carlos_rod_77123',
      isActive: true,
    },
  });

  // Access Logs for Carlos Rodriguez
  await prisma.accessLog.createMany({
    data: [
      {
        qrProfileId: qr3.id,
        userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-S908B) AppleWebKit/537.36 Chrome/114.0 Mobile Safari/537.36',
        accessType: 'QR_SCAN',
        ipAddress: '172.56.21.89',
        metadata: JSON.stringify({ device: 'Android Chrome', context: 'EMS Ambulance Scanner' }),
      },
      {
        qrProfileId: qr3.id,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
        accessType: 'QR_SCAN',
        ipAddress: '172.56.21.90',
        metadata: JSON.stringify({ device: 'Mobile Safari', context: 'Emergency Room Admission' }),
      },
    ],
  });

  // 5. Demo Patient 4: Priya Sharma (B+ Diabetic)
  const user4PasswordHash = await bcrypt.hash('Patient@123456', 10);
  const user4 = await prisma.user.upsert({
    where: { email: 'priya.sharma@example.com' },
    update: {},
    create: {
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@example.com',
      mobile: '+1-555-345-6789',
      passwordHash: user4PasswordHash,
      role: 'USER',
      dateOfBirth: '1993-03-21',
      gender: 'Female',
      isActive: true,
    },
  });

  await prisma.medicalProfile.upsert({
    where: { userId: user4.id },
    update: {},
    create: {
      userId: user4.id,
      bloodGroup: 'B+',
      rhFactor: 'Positive',
      address: '221B Baker St, London / Austin, TX 78701',
      allergies: 'Penicillin, Amoxicillin (Severe hives)',
      medicalConditions: 'Type 2 Diabetes, Hypothyroidism',
      chronicDiseases: 'Type 2 Diabetes',
      previousSurgeries: 'None',
      currentMedications: 'Metformin 850mg twice daily, Levothyroxine 50mcg',
      emergencyContactName: 'Raj Sharma',
      emergencyContactNumber: '+1-555-345-6780',
      emergencyContactRelationship: 'Father',
      preferredHospital: 'St. David Medical Center',
      primaryDoctor: 'Dr. Sanjay Gupta, MD',
      doctorContact: '+1-555-901-2345',
      height: '162 cm',
      weight: '58 kg',
      smokingStatus: 'Non-Smoker',
      alcoholStatus: 'No',
      organDonorStatus: 'Yes',
      insuranceProvider: 'UnitedHealthcare',
      insurancePolicyNumber: 'UHC-998877665',
    },
  });

  const qr4 = await prisma.qRProfile.upsert({
    where: { userId: user4.id },
    update: {},
    create: {
      userId: user4.id,
      secureToken: 'token_demo_priya_sharma_33912',
      isActive: true,
    },
  });

  await prisma.accessLog.create({
    data: {
      qrProfileId: qr4.id,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
      accessType: 'QR_SCAN',
      ipAddress: '10.0.0.12',
      metadata: JSON.stringify({ device: 'Hospital Workstation', department: 'ICU Triage' }),
    },
  });

  // 6. Demo Patient 5: David Kim (A+ Senior Patient)
  const user5PasswordHash = await bcrypt.hash('Patient@123456', 10);
  const user5 = await prisma.user.upsert({
    where: { email: 'david.kim@example.com' },
    update: {},
    create: {
      name: 'David Sun-Woo Kim',
      email: 'david.kim@example.com',
      mobile: '+1-555-678-1234',
      passwordHash: user5PasswordHash,
      role: 'USER',
      dateOfBirth: '1962-09-08',
      gender: 'Male',
      isActive: true,
    },
  });

  await prisma.medicalProfile.upsert({
    where: { userId: user5.id },
    update: {},
    create: {
      userId: user5.id,
      bloodGroup: 'A+',
      rhFactor: 'Positive',
      address: '450 North Michigan Ave, Chicago, IL 60611',
      allergies: 'Aspirin, Ibuprofen, Contrast Dye',
      medicalConditions: 'Coronary Artery Disease, Hypertension',
      chronicDiseases: 'Hypertension, Cardiac',
      previousSurgeries: 'Cardiac Stent Placement (2020)',
      currentMedications: 'Atorvastatin 40mg, Clopidogrel 75mg, Metoprolol 25mg',
      emergencyContactName: 'Grace Kim',
      emergencyContactNumber: '+1-555-678-1235',
      emergencyContactRelationship: 'Daughter',
      preferredHospital: 'Northwestern Memorial Hospital',
      primaryDoctor: 'Dr. Kevin Choi, MD',
      doctorContact: '+1-555-432-1098',
      height: '172 cm',
      weight: '81 kg',
      smokingStatus: 'Smoker (5-10/day)',
      alcoholStatus: 'Moderate',
      organDonorStatus: 'No',
      insuranceProvider: 'Medicare',
      insurancePolicyNumber: 'MEDICARE-66554433',
    },
  });

  console.log('🎉 Extended medical cohort seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
