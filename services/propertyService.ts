import { supabase } from './supabase';
import type { Property, City } from '../types';
import { MOCK_PROPERTIES } from '../utils/constants'; // Keep for score data for now

// This service now fetches real data from Supabase.

export const getAllProperties = async (): Promise<Property[]> => {
  console.log('Fetching all properties from Supabase...');
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }

  // For demonstration, we'll merge mock score data since it's not in the DB yet
  return data.map(property => {
    const mockProperty = MOCK_PROPERTIES.find(p => p.codigo === property.codigo);
    return {
      ...property,
      score: mockProperty ? mockProperty.score : { location: 70, costBenefit: 70, appreciation: 70, analysis: 'Análise pendente.' },
    } as Property;
  });
};


export const getFeaturedProperties = async (): Promise<Property[]> => {
  console.log('Fetching featured properties from Supabase...');
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
  
  return data.map(property => {
    const mockProperty = MOCK_PROPERTIES.find(p => p.codigo === property.codigo);
    return {
      ...property,
      score: mockProperty ? mockProperty.score : { location: 70, costBenefit: 70, appreciation: 70, analysis: 'Análise pendente.' },
    } as Property;
  });
};

export const getPropertyById = async (id: string): Promise<Property | undefined> => {
    console.log(`Fetching property with id: ${id} from Supabase`);
    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single(); // .single() returns one object instead of an array

    if (error) {
        console.error('Error fetching property by ID:', error);
        return undefined;
    }

    if (!data) return undefined;

    const mockProperty = MOCK_PROPERTIES.find(p => p.codigo === data.codigo);
    return {
        ...data,
        score: mockProperty ? mockProperty.score : { location: 70, costBenefit: 70, appreciation: 70, analysis: 'Análise pendente.' },
    } as Property;
};

export const getCities = async (): Promise<City[]> => {
    console.log('Fetching cities from Supabase...');
    const { data, error } = await supabase
        .from('cities')
        .select('id, name, state')
        .eq('active', true);
    
    if (error) {
        console.error('Error fetching cities:', error);
        // Fallback to deriving from properties if cities table is empty/errors
        const { data: propertiesData } = await supabase.from('properties').select('city');
        if (!propertiesData) return [];
        const cities = propertiesData.reduce((acc, curr) => {
            if (curr.city && !acc.find(c => c.name === curr.city)) {
                acc.push({ id: curr.city, name: curr.city, state: 'N/A' });
            }
            return acc;
        }, [] as City[]);
        return cities;
    }
    return data as City[];
};

export const addProperty = async (propertyData: Omit<Property, 'id' | 'created_at' | 'score' | 'images'> & { images: string[] }) => {
    const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single();
    return { data, error };
};

export const updateProperty = async (id: string, propertyData: Partial<Omit<Property, 'id' | 'created_at' | 'score'>>) => {
    const { data, error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', id)
        .select()
        .single();
    return { data, error };
};

export const deleteProperty = async (id: string) => {
    const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
    return { error };
};
