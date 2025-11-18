
import { supabase } from './supabase';
import type { Schedule } from '../types';

export const getSchedules = async (): Promise<Schedule[]> => {
  const { data, error } = await supabase
    .from('schedules')
    .select(`
      *,
      properties (
        codigo,
        title
      )
    `)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching schedules:', error);
    return [];
  }

  return data as Schedule[];
};

export const addSchedule = async (schedule: Omit<Schedule, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('schedules')
    .insert([schedule])
    .select()
    .single();
  return { data, error };
};

export const updateScheduleStatus = async (id: number, status: string) => {
  const { data, error } = await supabase
    .from('schedules')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteSchedule = async (id: number) => {
    const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);
    return { error };
};
