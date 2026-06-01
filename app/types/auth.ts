import type { PlanSlug } from '~/types/plan';

export interface User {
  id: number;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  email_verified_at: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  telegram_chat_id: string | null;
  google_id: string | null;
  is_admin?: boolean;
  plan?: PlanSlug | string | null;
  site_limit?: number | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}
