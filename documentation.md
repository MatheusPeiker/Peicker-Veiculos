# Documentação: Peicker Veículos Premium

Esta documentação descreve a arquitetura, as tecnologias, a estrutura do projeto e as principais funcionalidades do sistema **Peicker Veículos Premium**, um catálogo de veículos de alto padrão desenvolvido com React.

## Visão Geral do Projeto

O **Peicker Veículos Premium** é uma aplicação web voltada para a exibição de um catálogo de veículos de luxo. A plataforma permite que os usuários explorem o estoque da concessionária, apliquem filtros avançados para encontrar o veículo ideal, visualizem fotos detalhadas e entrem em contato diretamente via WhatsApp para negociações.

## Stack Tecnológico

A aplicação foi construída utilizando tecnologias modernas focadas em performance, design e componentização:

- **Frontend**: React 19
- **Roteamento**: React Router DOM (v7)
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS (inferido pelas classes utilitárias no código, proporcionando um design moderno com suporte nativo a dark mode, animações, glassmorphism, etc.)
- **Linguagem**: TypeScript
- **Backend / Database**: Supabase (BaaS - Backend as a Service)

## Arquitetura de Dados (Supabase)

A aplicação consome dados de um banco de dados hospedado no **Supabase**. A tabela principal do sistema é a de veículos.

### Schema: `veiculos`
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `number` | Identificador único do veículo. |
| `marca` | `string` | Marca do fabricante (ex: BMW, Porsche, Audi). |
| `modelo` | `string` | Nome do modelo do veículo. |
| `ano` | `string` | Ano de fabricação e/ou modelo. |
| `preco` | `number` | Valor de venda do veículo. |
| `quilometragem` | `string` | Quilometragem atual. |
| `cambio` | `string` | Tipo de transmissão (Automático, Manual). |
| `combustivel` | `string` | Tipo de combustível (Gasolina, Flex, Diesel, Elétrico). |
| `tipo` | `string` | Categoria do veículo (Carro, Moto). |
| `imagem_url` | `string` / `string[]` | URLs das imagens do veículo (pode ser uma string com separação por quebra de linha/vírgula ou um array). |

## Estrutura de Páginas e Funcionalidades

O sistema é dividido em rotas principais que oferecem uma experiência de navegação contínua ("Single Page Application").

### 1. Home (`/`)
A página inicial é desenhada para causar impacto visual.
- **Hero Section**: Exibe um banner principal com chamadas para ação (Explorar Estoque / Fale Conosco).
- **Brand Carousel**: Componente (`<BrandCarousel />`) que exibe as marcas de luxo com as quais a concessionária trabalha.
- **Destaques**: Uma seção que consome do Supabase os 3 veículos mais recentes cadastrados, destacando informações vitais como preço, ano, quilometragem, combustível e a foto principal.

### 2. Estoque / Catálogo (`/estoque`)
O coração da aplicação, onde todo o inventário é listado.
- **Filtros Avançados**: Uma barra lateral (sidebar) rica que permite aos usuários filtrar por:
  - Marca do veículo.
  - Tipo (Carro ou Moto).
  - Câmbio.
  - Combustível.
  - Faixa de preço máximo (slider dinâmico).
  - Busca de texto livre (Modelo, marca ou ano).
- **Visualização**: Os usuários podem alternar a visualização da listagem entre os modos "Grid" e "Lista".
- **Responsividade**: Em dispositivos móveis, os filtros se comportam como um modal sobreposto (overlay) com transições suaves.

### 3. Detalhes do Veículo (`/vehicle/:id`)
Página focada na conversão e demonstração do produto.
- **Galeria de Imagens Interativa**: O usuário pode rolar as imagens no estilo carrossel. 
- **Lightbox Overlay**: Ao clicar em uma imagem, a mesma é aberta em tela cheia com fundo desfocado. O lightbox suporta:
  - Navegação via teclado (Setas e ESC).
  - Navegação mobile via touch (arrastar para baixo para fechar).
- **Ficha Técnica**: Exibição detalhada de atributos técnicos.
- **Call-to-Action**: Um botão primário em destaque leva o usuário diretamente para o WhatsApp do consultor de vendas. A mensagem já vai pré-formatada incluindo a marca, modelo e ano do veículo que o cliente estava visualizando.

### 4. Contato (`/contact`)
Página institucional com canais de atendimento.
- **Informações da Loja**: Exibição do endereço (com link de redirecionamento), telefone, botão para WhatsApp e redes sociais (Instagram, Facebook).
- **Formulário de Contato**: Interface que simula o envio de uma mensagem com estados visuais de "Enviando", "Mensagem Enviada" ou "Erro".
- **Integração de Mapa**: Google Maps integrado na página apontando a loja física em Timbó, Santa Catarina.

## Experiência de Usuário e Design UI/UX

A construção do app tomou grande inspiração em design web premium contemporâneo.

> [!NOTE]
> Foram utilizadas práticas avançadas de UI para garantir fluidez e um ar requintado para o catálogo de veículos.
- **Animações e Micro-interações**: Diversos elementos contam com transições `hover`, expansões de imagem (scale-110), fade-ins (usando a customização `.animate-fade-in-up`) que tornam a interface viva.
- **Glassmorphism**: Componentes como modais e fundos de botões possuem propriedades de desfoque (`backdrop-blur-md`).
- **Dark Mode Compatibility**: A aplicação já contempla o tema escuro com suporte às diretivas do Tailwind (`dark:bg-background-dark`, `dark:text-white`, etc).
- **Tratamento de Exceções visuais**: Fallbacks inteligentes aplicados. Por exemplo, se a imagem de um carro não for encontrada ou a URL vier quebrada, o frontend insere fotos de placeholder de carros e emite layouts graciosos para contornar o erro (`onError` na tag de imagem).

## Comandos de Desenvolvimento

A aplicação é simples de ser rodada localmente. Usa Node.js como motor principal.

1. **Instalar Dependências:**
```bash
npm install
```

2. **Rodar em Modo Desenvolvimento:**
```bash
npm run dev
```

3. **Gerar Versão de Produção:**
```bash
npm run build
```

---
*Este documento resume toda a estrutura arquitetônica e escolhas de design feitas durante a criação do projeto da Peicker Veículos.*
