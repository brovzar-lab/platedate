export interface UserDoc {
  coupleId: string | null;
  role: 'partner1' | 'partner2' | null;
  displayName: string;
  city: string;
}
