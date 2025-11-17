
import { MOCK_PROPERTIES } from '../utils/constants';
import type { Property, City } from '../types';

// This is a mock service. In a real application, these functions
// would make API calls to a backend like Supabase.

export const getFeaturedProperties = async (): Promise<Property[]> => {
  console.log('Fetching featured properties...');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_PROPERTIES.filter(p => p.featured));
    }, 500);
  });
};

export const getAllProperties = async (): Promise<Property[]> => {
  console.log('Fetching all properties...');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_PROPERTIES);
    }, 500);
  });
};

export const getPropertyById = async (id: string): Promise<Property | undefined> => {
    console.log(`Fetching property with id: ${id}`);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(MOCK_PROPERTIES.find(p => p.id === id));
        }, 500);
    });
};

export const getCities = async (): Promise<City[]> => {
    console.log('Fetching cities...');
    return new Promise(resolve => {
        setTimeout(() => {
            const cities = MOCK_PROPERTIES.reduce((acc, curr) => {
                if (!acc.find(c => c.name === curr.city)) {
                    acc.push({ id: curr.city, name: curr.city, state: 'N/A' });
                }
                return acc;
            }, [] as City[]);
            resolve(cities);
        }, 300);
    });
}
