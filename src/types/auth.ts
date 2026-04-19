export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  public_id?: string;
  tier?: 'standard' | 'pro' | 'institutional';
  created_at: string;
}

export interface AuthState {
  user: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials extends LoginCredentials {
  full_name: string;
}
