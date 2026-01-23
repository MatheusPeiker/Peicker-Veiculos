
import { Car, Review } from './types';

// CARS_DATA removed to use Supabase
export const CARS_DATA: Car[] = [];

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
