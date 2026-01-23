
import { Car, Review } from './types';

export const CARS_DATA: Car[] = [
  {
    id: 'chevrolet-joy-plus',
    brand: 'Chevrolet',
    model: 'Joy Plus 1.0 MT',
    year: '2021/2021',
    km: '38.000 km',
    price: 64900,
    transmission: 'Manual',
    fuel: 'Flex',
    color: 'Branco Summit',
    interior: 'Tecido Premium Anthracite',
    engine: '1.0 SPE/4',
    power: '80 cv',
    acceleration: '13.3s',
    traction: 'Dianteira',
    images: [
      'hero-car.jpg', // Usando a imagem enviada pelo usuário
      'https://images.unsplash.com/photo-1631435223000-28fef9300305?auto=format&fit=crop&q=80&w=1200'
    ],
    description: 'Veículo extremamente econômico e espaçoso. Perfeito para o dia a dia e viagens em família. Revisado e com garantia Peicker.',
    isNew: false,
    isFeatured: true
  },
  {
    id: 'porsche-911',
    brand: 'Porsche',
    model: '911 Carrera S 2024',
    year: '2023/24',
    km: '0 km',
    price: 1250000,
    transmission: 'Automático',
    fuel: 'Gasolina',
    color: 'Amarelo Racing Metálico',
    interior: 'Bordeaux Red',
    engine: '3.0 Boxer Turbo',
    power: '450 cv',
    acceleration: '3.7s',
    traction: 'Traseira',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDmWpXyXBrBE9LA6nIRBKX9cRWUp3hDohJBU5Bz4qftvYR1s0O51iXg2nO-aLG5fRPbmsR4W57AmSeiArpAnXHzsRXFYHev3X0pffi5zCII-Diid4lLYtXYPdLjAqdPgIAI1DJWxbwC572MLblGR4KOXcX-7xIXGKrMvLmZAGEo0-2AbtYQmp5o4a3g5Jdd-E5FtFiWLc1hDqfP7tR5oCodxTT4DrLAj_KYFKPUB4HYZraAosL2-GFYxBQL6lZLTI_55eyfkJMjEQwV',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBTMD1IBi9uABjzcS3X2EJ-HRCRTm_RRUkMZKP2nCsEHsqNnqm-VSXhffhEzhIroWt5luMz0NG5BxYG7g4rhnRIiO6JIa4FdW7lEzh8DbWIGNCI_SnXKIjiHN-lIohYyx9Y1ih4GftBT8OF4UYCCnFaGCPegxU8-_tWMtLqlA9_nk0KXcbfXh9xLawUS_g6uZ5FMDkR9UkR2fATJW2LzI5_jN78t6KpXOkm1G3hj_UDPw75ckQuyS9wSv65AswAsOe6zL7wdUtzV9Qk'
    ],
    description: 'Veículo em estado de zero, sem detalhes. Equipado com pacote Sport Chrono.',
    isNew: true,
    isFeatured: true
  },
  {
    id: 'toyota-corolla-gr',
    brand: 'Toyota',
    model: 'Corolla GR-S',
    year: '2022/23',
    km: '15.000 km',
    price: 165000,
    transmission: 'Automático',
    fuel: 'Flex',
    color: 'Branco Lunar',
    interior: 'Couro GR',
    engine: '2.0 Dynamic Force',
    power: '177 cv',
    acceleration: '9.2s',
    traction: 'Dianteira',
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=1200'],
    description: 'Visual esportivo com a confiabilidade Toyota. Suspensão recalibrada pela Gazoo Racing.',
    isFeatured: true
  },
  {
    id: 'jeep-compass-s',
    brand: 'Jeep',
    model: 'Compass S T270',
    year: '2023/24',
    km: '5.000 km',
    price: 215000,
    transmission: 'Automático',
    fuel: 'Flex',
    color: 'Deep Brown',
    interior: 'Preto Premium',
    engine: '1.3 Turbo',
    power: '185 cv',
    acceleration: '8.8s',
    traction: 'Dianteira',
    images: ['https://images.unsplash.com/photo-1631435223000-28fef9300305?auto=format&fit=crop&q=80&w=1200'],
    description: 'A versão topo de linha do SUV mais desejado do Brasil. Som Beats e teto panorâmico.',
    isFeatured: true
  }
];

export const REVIEWS_DATA: Review[] = [
  {
    id: '1',
    name: 'Ricardo Mendes',
    car: 'Chevrolet Joy Plus',
    text: 'A qualidade dos carros da Peicker é diferenciada. Atendimento transparente e veículo impecável.',
    image: 'https://picsum.photos/seed/ricardo/200/200'
  },
  {
    id: '2',
    name: 'Fábio Silveira',
    car: 'Porsche 911',
    text: 'Finalmente encontrei uma revenda que entende o mercado de seminovos e novos em Curitiba.',
    image: 'https://picsum.photos/seed/fabio/200/200'
  }
];
