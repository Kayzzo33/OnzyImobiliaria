
export type PropertyType = 'casa' | 'apartamento' | 'kitnet';
export type PropertyStatus = 'disponivel' | 'alugado' | 'vendido';

export interface ImovelScore {
  location: number;
  costBenefit: number;
  appreciation: number;
  analysis: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area_m2: number;
  address: string;
  city: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  images: string[];
  status: PropertyStatus;
  featured: boolean;
  score: ImovelScore;
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
