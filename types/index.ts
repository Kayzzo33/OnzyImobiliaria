
import type { User } from '@supabase/supabase-js';

export type PropertyType = 'casa' | 'apartamento' | 'kitnet';
export type PropertyStatus = 'disponivel' | 'alugado' | 'vendido';
export type PropertyPurpose = 'venda' | 'aluguel';

export interface ImovelScore {
  location: number;
  costBenefit: number;
  appreciation: number;
  analysis: string;
}

export interface Property {
  id: string;
  codigo: string;
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  bedrooms: number;
  bathrooms: number;
  vagas: number;
  area_m2: number;
  address: string;
  city: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  images: string[];
  status: PropertyStatus;
  finalidade: PropertyPurpose;
  featured: boolean;
  score: ImovelScore;
  created_at?: string; // Campo adicionado pelo Supabase

  // Detailed amenities
  furnished?: boolean;
  pets_allowed?: boolean;
  leisure_area?: boolean;
  gym?: boolean;
  pool?: boolean;
  barbecue_grill?: boolean;
  backyard?: boolean;
  concierge_24h?: boolean;
  elevator?: boolean;
  balcony?: boolean;
  built_in_closets?: boolean;
  air_conditioning?: boolean;
}

export interface City {
  id: string;
  name: string;
  state: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  properties?: Property[];
}

// Export Supabase User type for consistency
export type { User };
