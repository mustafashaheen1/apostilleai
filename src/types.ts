
export interface User {
  id: number;
  email: string;
  name: string;
  picture?: string;
  provider: string;
  provider_id?: string;
  created_at: Date;
  updated_at: Date;
}
