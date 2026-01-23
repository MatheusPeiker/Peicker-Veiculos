

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: string;
  km: string;
  price: number;
  transmission: 'Automático' | 'Manual';
  // Fix: Added 'Flex' to the fuel union type to accommodate vehicles using flex fuel in the Brazilian market
  fuel: 'Gasolina' | 'Diesel' | 'Híbrido' | 'Elétrico' | 'Flex';
  color: string;
  interior: string;
  engine: string;
  power: string;
  acceleration: string;
  traction: string;
  images: string[];
  description: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface Review {
  id: string;
  name: string;
  car: string;
  text: string;
  image: string;
}