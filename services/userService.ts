
import { supabase } from './supabase';
import type { UserProfile } from '../types';

export const getUsers = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name', { ascending: true });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  return data as UserProfile[];
};

// Note: Creating users usually happens via Auth Sign Up. 
// Updating profile roles would happen here.
export const updateUserRole = async (id: string, role: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', id);
    return { data, error };
};
