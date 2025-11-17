
import type { Property } from '../types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Apartamento Moderno no Coração da Cidade',
    description: 'Um apartamento elegante e moderno com vistas deslumbrantes da cidade. Perfeito para quem busca conforto e conveniência.',
    type: 'apartamento',
    price: 750000,
    bedrooms: 2,
    bathrooms: 2,
    area_m2: 90,
    address: 'Av. Paulista, 1500',
    city: 'São Paulo',
    neighborhood: 'Bela Vista',
    latitude: -23.5613,
    longitude: -46.6565,
    images: [
      'https://picsum.photos/seed/prop1-1/800/600',
      'https://picsum.photos/seed/prop1-2/800/600',
      'https://picsum.photos/seed/prop1-3/800/600',
    ],
    status: 'disponivel',
    featured: true,
    score: {
      location: 95,
      costBenefit: 80,
      appreciation: 88,
      analysis: 'Localização premium com alto potencial de valorização. O custo-benefício é bom, considerando a área e as comodidades.'
    }
  },
  {
    id: '2',
    title: 'Casa Espaçosa com Quintal e Piscina',
    description: 'Casa ideal para famílias, com amplo espaço externo, piscina e área de churrasco. Um refúgio de tranquilidade.',
    type: 'casa',
    price: 1200000,
    bedrooms: 4,
    bathrooms: 3,
    area_m2: 250,
    address: 'Rua das Flores, 123',
    city: 'Campinas',
    neighborhood: 'Alphaville',
    latitude: -22.83,
    longitude: -47.05,
    images: [
      'https://picsum.photos/seed/prop2-1/800/600',
      'https://picsum.photos/seed/prop2-2/800/600',
      'https://picsum.photos/seed/prop2-3/800/600',
    ],
    status: 'disponivel',
    featured: true,
    score: {
      location: 85,
      costBenefit: 92,
      appreciation: 90,
      analysis: 'Excelente custo-benefício pelo tamanho e lazer. Bairro em constante desenvolvimento com grande potencial de valorização.'
    }
  },
  {
    id: '3',
    title: 'Kitnet Aconchegante Próximo à Universidade',
    description: 'Kitnet funcional e bem localizada, perfeita para estudantes ou jovens profissionais. Totalmente mobiliada e pronta para morar.',
    type: 'kitnet',
    price: 250000,
    bedrooms: 1,
    bathrooms: 1,
    area_m2: 35,
    address: 'Rua do Saber, 42',
    city: 'Belo Horizonte',
    neighborhood: 'Pampulha',
    latitude: -19.86,
    longitude: -43.97,
    images: [
      'https://picsum.photos/seed/prop3-1/800/600',
      'https://picsum.photos/seed/prop3-2/800/600',
    ],
    status: 'alugado',
    featured: false,
    score: {
      location: 90,
      costBenefit: 88,
      appreciation: 75,
      analysis: 'Ótima localização para o público universitário. Custo-benefício muito bom para a região. Valorização moderada.'
    }
  },
   {
    id: '4',
    title: 'Cobertura Duplex com Vista Panorâmica',
    description: 'Luxuosa cobertura com piscina privativa e vista de 360 graus. Acabamentos de alto padrão e design exclusivo.',
    type: 'apartamento',
    price: 3500000,
    bedrooms: 3,
    bathrooms: 4,
    area_m2: 320,
    address: 'Rua Oscar Freire, 900',
    city: 'São Paulo',
    neighborhood: 'Jardins',
    latitude: -23.567,
    longitude: -46.667,
    images: [
      'https://picsum.photos/seed/prop4-1/800/600',
      'https://picsum.photos/seed/prop4-2/800/600',
      'https://picsum.photos/seed/prop4-3/800/600',
    ],
    status: 'disponivel',
    featured: true,
    score: {
      location: 98,
      costBenefit: 75,
      appreciation: 95,
      analysis: 'Imóvel de altíssimo padrão em uma das localizações mais desejadas. Potencial de valorização garantido.'
    }
  },
  {
    id: '5',
    title: 'Casa de Condomínio com Lazer Completo',
    description: 'More com segurança e qualidade de vida. Casa em condomínio fechado com academia, quadras e salão de festas.',
    type: 'casa',
    price: 980000,
    bedrooms: 3,
    bathrooms: 3,
    area_m2: 180,
    address: 'Av. das Américas, 5000',
    city: 'Rio de Janeiro',
    neighborhood: 'Barra da Tijuca',
    latitude: -22.99,
    longitude: -43.36,
    images: [
      'https://picsum.photos/seed/prop5-1/800/600',
      'https://picsum.photos/seed/prop5-2/800/600',
      'https://picsum.photos/seed/prop5-3/800/600',
    ],
    status: 'vendido',
    featured: false,
    score: {
      location: 88,
      costBenefit: 85,
      appreciation: 82,
      analysis: 'Ideal para famílias que buscam segurança e lazer. Bom custo-benefício para a região. Valorização constante.'
    }
  },
   {
    id: '6',
    title: 'Apartamento de 1 Quarto perto do Metrô',
    description: 'Praticidade e mobilidade. Apartamento compacto e moderno a poucos passos da estação de metrô.',
    type: 'apartamento',
    price: 450000,
    bedrooms: 1,
    bathrooms: 1,
    area_m2: 45,
    address: 'Rua Vergueiro, 2000',
    city: 'São Paulo',
    neighborhood: 'Vila Mariana',
    latitude: -23.58,
    longitude: -46.63,
    images: [
      'https://picsum.photos/seed/prop6-1/800/600',
      'https://picsum.photos/seed/prop6-2/800/600',
    ],
    status: 'disponivel',
    featured: false,
    score: {
      location: 92,
      costBenefit: 85,
      appreciation: 80,
      analysis: 'Localização estratégica para quem usa transporte público. Ótimo para investimento e aluguel.'
    }
  },
];
