
import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import type { User } from '../types';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: true, // Start with loading true until the first check is done
  setSession: (session) => {
    set({ 
      session, 
      user: session?.user ?? null,
      loading: false 
    });
  },
}));
