export default interface SearchQuery {
  name?: string;
  adress?: string;
  radius?: number;
  languages?: string;
  specialties?: string;
  acceptsPrivateInsurance?: boolean;
  canWriteMedication?: boolean;
}
