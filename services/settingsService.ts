
import { supabase } from './supabase';
import type { AppSettings } from '../types';

export const getSettings = async (): Promise<AppSettings | null> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single(); // Assuming only one row for settings

  if (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
  return data as AppSettings;
};

export const updateSettings = async (settings: AppSettings) => {
    // We use upsert to handle both insert (first time) and update
    // Assuming ID 1 is the main settings row, or we ignore ID and just ensure one row exists logically
    const payload = { ...settings };
    if (!payload.id) {
        // Fetch ID if not present to ensure update instead of insert if row exists
        const current = await getSettings();
        if (current?.id) payload.id = current.id;
    }

    const { data, error } = await supabase
        .from('settings')
        .upsert(payload)
        .select()
        .single();
    return { data, error };
};
