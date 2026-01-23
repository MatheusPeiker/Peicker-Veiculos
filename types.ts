export interface Veiculo {
  id: number;
  marca: string;
  modelo: string;
  ano: string;
  preco: number;
  quilometragem: string;
  cambio: string;
  combustivel: string;
  tipo: string;
  imagem_url: string;
  isFeatured?: boolean; // Optional, added for frontend compatibility if needed
}

export type Car = Veiculo;