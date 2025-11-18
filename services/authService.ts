
import { supabase } from './supabase';

export const authService = {
  signIn: async ({ email, password }: { email: string; password: string; }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
};
