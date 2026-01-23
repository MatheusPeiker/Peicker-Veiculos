import React from 'react';
import { Link } from 'react-router-dom';

const BRANDS = [
    { name: 'Fiat', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Fiat_Automobiles_logo.svg/2048px-Fiat_Automobiles_logo.svg.png' },
    { name: 'Volkswagen', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/2048px-Volkswagen_logo_2019.svg.png' },
    { name: 'Chevrolet', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Chevrolet_logo.svg/800px-Chevrolet_logo.svg.png' },
    { name: 'Renault', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Renault_2009_logo.svg/2560px-Renault_2009_logo.svg.png' },
    { name: 'Hyundai', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Hyundai_Motor_Company_logo.svg/2560px-Hyundai_Motor_Company_logo.svg.png' },
    { name: 'Ford', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/2560px-Ford_logo_flat.svg.png' },
];

export const BrandCarousel: React.FC = () => {
    return (
        <div className="w-full bg-slate-50 dark:bg-black/20 py-10 overflow-hidden border-y border-slate-100 dark:border-white/5">
            <div className="max-w-7xl mx-auto px-4 mb-4">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 text-center">Nossas Marcas</p>
            </div>

            {/* Container para animação infinita */}
            <div className="overflow-hidden group flex">
                <div className="flex gap-24 animate-marquee whitespace-nowrap py-4 items-center">
                    {/* Renderiza a lista duas vezes para um loop perfeito */}
                    {[...BRANDS, ...BRANDS].map((brand, index) => (
                        <Link
                            key={`${brand.name}-${index}`}
                            to={`/estoque?brand=${brand.name}`}
                            className="relative flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 opacity-40 hover:opacity-100 hover:scale-110 transform"
                        >
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="h-12 w-auto max-w-[150px] object-contain dark:invert"
                            />
                        </Link>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: max-content;
          padding-right: 6rem; /* Gap компенсация */
        }
        /* Pausa a animação no hover */
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
};
