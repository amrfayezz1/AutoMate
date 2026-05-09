import { supabase } from '@/lib/supabase';
import type { Tables } from '@/supabase/database.types';

export type Car = Tables<'cars'>;

export async function fetchCars(): Promise<Car[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchCarById(id: string): Promise<Car> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .eq('user_id', session.user.id)
    .single();

  if (error) throw error;
  return data;
}
