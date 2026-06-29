export interface Couple {
  id: string;
  joinCode: string;
  partner1UserId: string | null;
  partner2UserId: string | null;
  createdAt: string;
}

export type PartnerId = 'partner1' | 'partner2';
