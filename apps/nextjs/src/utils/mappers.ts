interface TargetType {
  id: number;
  name: string;
  email: string;
  profile: string;
  address: string;
  zip: string;
  city: string;
  state: string;
  authId: string;
  phone: string;
}
type SourceType = {
  id: number;
  name: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  phoneNumber: string | null;
  profile: string | null;
  address: string | null;
  zip: string | null;
  city: string | null;
  state: string | null;
  authId: string | null;
}[];
export function mapSourceToTarget(
  sourceData: SourceType | undefined,
): TargetType[] {
  if (!sourceData) return [];

  return sourceData.map((client) => ({
    id: client.id || 0,
    name: client.name || "",
    email: client.email || "",
    profile: client.profile || "",
    address: client.address || "",
    zip: client.zip || "",
    city: client.city || "",
    state: client.state || "",
    authId: client.authId || "",
    phone: client.phoneNumber || "",
  }));
}
