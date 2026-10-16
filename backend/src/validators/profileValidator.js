const { z } = require('zod');

const medicalProfileSchema = z.object({
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    errorMap: () => ({ message: 'Please select a valid Blood Group' }),
  }),
  rhFactor: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  medicalConditions: z.string().optional().nullable(),
  chronicDiseases: z.string().optional().nullable(),
  previousSurgeries: z.string().optional().nullable(),
  currentMedications: z.string().optional().nullable(),
  previousMedications: z.string().optional().nullable(),
  disabilityInfo: z.string().optional().nullable(),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactNumber: z.string().min(5, 'Emergency contact phone number is required'),
  emergencyContactRelationship: z.string().min(2, 'Relationship to emergency contact is required'),
  preferredHospital: z.string().optional().nullable(),
  primaryDoctor: z.string().optional().nullable(),
  doctorContact: z.string().optional().nullable(),
  height: z.string().optional().nullable(),
  weight: z.string().optional().nullable(),
  smokingStatus: z.string().optional().nullable(),
  alcoholStatus: z.string().optional().nullable(),
  organDonorStatus: z.string().optional().nullable(),
  insuranceProvider: z.string().optional().nullable(),
  insurancePolicyNumber: z.string().optional().nullable(),
  additionalNotes: z.string().optional().nullable(),
  consentAccepted: z.boolean().optional(),
});

module.exports = {
  medicalProfileSchema,
};
