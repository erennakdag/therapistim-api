export default interface CustomTherapistCreateInput {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  bio: string;
  adress: string;
  institutionName?: string;
  languages: string;
  specialties: string;
  canWriteMedication: boolean;
  website?: string;
  acceptsPrivateInsurance?: boolean;
}
