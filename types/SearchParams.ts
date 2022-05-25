export default interface SearchParams {
  input?: string;
  place: string;
  radius: number;
  languages?: string[];
  specialties?: string[];
  acceptsPrivateInsurance?: boolean;
  canWriteMedication?: boolean;
}
