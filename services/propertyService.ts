
import { supabase } from './supabase';
import type { Property, City } from '../types';
import { MOCK_PROPERTIES } from '../utils/constants'; // Keep for fallback if needed

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

  return data.map(property => {
    // If score is missing in DB (old records), try to find in mock or default
    const mockProperty = MOCK_PROPERTIES.find(p => p.codigo === property.codigo);
    const score = property.score || (mockProperty ? mockProperty.score : { location: 70, costBenefit: 70, appreciation: 70, analysis: 'Análise pendente.' });

    return {
      ...property,
      // Ensure amenities are present (defaulting to false if null in DB)
      furnished: property.furnished || false,
      pets_allowed: property.pets_allowed || false,
      leisure_area: property.leisure_area || false,
      gym: property.gym || false,
      pool: property.pool || false,
      barbecue_grill: property.barbecue_grill || false,
      backyard: property.backyard || false,
      concierge_24h: property.concierge_24h || false,
      elevator: property.elevator || false,
      balcony: property.balcony || false,
      built_in_closets: property.built_in_closets || false,
      air_conditioning: property.air_conditioning || false,
      views: property.views || 0,
      score: score
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
    const score = property.score || (mockProperty ? mockProperty.score : { location: 70, costBenefit: 70, appreciation: 70, analysis: 'Análise pendente.' });

    return {
      ...property,
      furnished: property.furnished || false,
      pets_allowed: property.pets_allowed || false,
      leisure_area: property.leisure_area || false,
      gym: property.gym || false,
      pool: property.pool || false,
      barbecue_grill: property.barbecue_grill || false,
      backyard: property.backyard || false,
      concierge_24h: property.concierge_24h || false,
      elevator: property.elevator || false,
      balcony: property.balcony || false,
      built_in_closets: property.built_in_closets || false,
      air_conditioning: property.air_conditioning || false,
      views: property.views || 0,
      score: score
    } as Property;
  });
};

export const getPropertyById = async (id: string): Promise<Property | undefined> => {
    console.log(`Fetching property with id: ${id} from Supabase`);
    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching property by ID:', error);
        return undefined;
    }

    if (!data) return undefined;

    const mockProperty = MOCK_PROPERTIES.find(p => p.codigo === data.codigo);
    const score = data.score || (mockProperty ? mockProperty.score : { location: 70, costBenefit: 70, appreciation: 70, analysis: 'Análise pendente.' });

    return {
        ...data,
        furnished: data.furnished || false,
        pets_allowed: data.pets_allowed || false,
        leisure_area: data.leisure_area || false,
        gym: data.gym || false,
        pool: data.pool || false,
        barbecue_grill: data.barbecue_grill || false,
        backyard: data.backyard || false,
        concierge_24h: data.concierge_24h || false,
        elevator: data.elevator || false,
        balcony: data.balcony || false,
        built_in_closets: data.built_in_closets || false,
        air_conditioning: data.air_conditioning || false,
        views: data.views || 0,
        score: score
    } as Property;
};

export const incrementPropertyViews = async (id: string) => {
    // Calls the database function 'increment_views'
    const { error } = await supabase.rpc('increment_views', { row_id: id });
    if (error) console.error('Error incrementing views:', error);
};

export const getCities = async (): Promise<City[]> => {
    console.log('Fetching cities from Supabase...');
    const { data, error } = await supabase
        .from('cities')
        .select('id, name, state')
        .eq('active', true);
    
    if (error) {
        console.error('Error fetching cities:', error);
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

export const addProperty = async (propertyData: Omit<Property, 'id' | 'created_at' | 'images'> & { images: string[] }) => {
    const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single();
    return { data, error };
};

export const updateProperty = async (id: string, propertyData: Partial<Omit<Property, 'id' | 'created_at'>>) => {
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
