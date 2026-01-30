import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';

// Extended brand logos with multiple name variations
// Extended brand logos with multiple name variations
const BRAND_LOGOS: Record<string, string> = {
    // Common variations
    'fiat': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Fiat_Automobiles_logo.svg/2048px-Fiat_Automobiles_logo.svg.png',
    'volkswagen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/2048px-Volkswagen_logo_2019.svg.png',
    'vw': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/2048px-Volkswagen_logo_2019.svg.png',
    'volks': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/2048px-Volkswagen_logo_2019.svg.png',
    'chevrolet': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Chevrolet_logo.svg/800px-Chevrolet_logo.svg.png',
    'gm': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Chevrolet_logo.svg/800px-Chevrolet_logo.svg.png',
    'renault': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Renault_2009_logo.svg/2560px-Renault_2009_logo.svg.png',
    'hyundai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Hyundai_Motor_Company_logo.svg/2560px-Hyundai_Motor_Company_logo.svg.png',
    'ford': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/2560px-Ford_logo_flat.svg.png',
    'toyota': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/1200px-Toyota_carlogo.svg.png',
    'honda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/2560px-Honda.svg.png',
    'jeep': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Jeep_logo.svg/2560px-Jeep_logo.svg.png',
    'nissan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Nissan_logo.svg/2560px-Nissan_logo.svg.png',
    'mitsubishi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Mitsubishi_logo.svg/2560px-Mitsubishi_logo.svg.png',
    'bmw': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/2048px-BMW.svg.png',
    'mercedesbenz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_logo.svg/2048px-Mercedes-Benz_logo.svg.png',
    'mercedes': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_logo.svg/2048px-Mercedes-Benz_logo.svg.png',
    'audi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/2560px-Audi-Logo_2016.svg.png',
    'kia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Kia_logo.svg/2560px-Kia_logo.svg.png',
    'citroen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Citroën_2009.svg/2560px-Citroën_2009.svg.png',
    'peugeot': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Peugeot_Logo.svg/2560px-Peugeot_Logo.svg.png',
    'chery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Chery_logo.svg/2560px-Chery_logo.svg.png',
    'caoachery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Chery_logo.svg/2560px-Chery_logo.svg.png',
    'suzuki': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/2560px-Suzuki_logo_2.svg.png',
    'subaru': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Subaru_logo.svg/2560px-Subaru_logo.svg.png',
    'volvo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Volvo_Cars_logo.svg/2560px-Volvo_Cars_logo.svg.png',
    'landrover': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Land_Rover_logo.svg/2560px-Land_Rover_logo.svg.png',
    'jaguar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Jaguar_Cars_logo.svg/2560px-Jaguar_Cars_logo.svg.png',
    'porsche': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Porsche_logo.svg/2560px-Porsche_logo.svg.png',
    'ram': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/RAM_logo.svg/2560px-RAM_logo.svg.png',
    'dodge': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Dodge_logo.svg/2560px-Dodge_logo.svg.png',
    'chrysler': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Chrysler_logo.svg/2560px-Chrysler_logo.svg.png',
    'byd': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/BYD_Auto_Logo_2022.svg/2560px-BYD_Auto_Logo_2022.svg.png',
    'gwm': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Great_Wall_Motors_Logo.svg/2560px-Great_Wall_Motors_Logo.svg.png',
    'haval': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Haval_Logo.svg/1200px-Haval_Logo.svg.png',
    'troller': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Troller_Ve%C3%ADculos_Especiais_S.A._logo.svg/2560px-Troller_Ve%C3%ADculos_Especiais_S.A._logo.svg.png',
    'lexus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lexus_logo.svg/2560px-Lexus_logo.svg.png',
    'mini': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Mini_logo.svg/2560px-Mini_logo.svg.png',
    'jac': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/JAC_Motors_logo.svg/2560px-JAC_Motors_logo.svg.png',
    'jacmotors': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/JAC_Motors_logo.svg/2560px-JAC_Motors_logo.svg.png',
    'land': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Land_Rover_logo.svg/2560px-Land_Rover_logo.svg.png', // Handle "Land" from "Land Rover"
    'rover': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Land_Rover_logo.svg/2560px-Land_Rover_logo.svg.png', // Handle "Rover"
};

// Normalize brand name for matching (remove accents, lowercase, keep only alphanumeric)
const normalizeBrand = (brand: string): string => {
    return brand
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]/g, ''); // Keep only alphanumeric
};

// Find logo URL with normalized matching
const findLogoUrl = (brand: string): string | null => {
    const normalizedInput = normalizeBrand(brand);

    // Try direct match after strict normalization
    if (BRAND_LOGOS[normalizedInput]) {
        return BRAND_LOGOS[normalizedInput];
    }

    // Fallback: Check if the input contains any key word that is distinct enough
    // We avoid generic "key includes input" to prevent "a" matching "audi"
    // Instead we check if mapped keys are contained in input (e.g. input "Land Rover Evoque" contains key "landrover")
    const keyMatch = Object.keys(BRAND_LOGOS).find(key => normalizedInput.includes(key));
    if (keyMatch) return BRAND_LOGOS[keyMatch];

    return null;
};

export const BrandCarousel: React.FC = () => {
    const [availableBrands, setAvailableBrands] = useState<string[]>([]);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const fetchBrands = async () => {
            const { data } = await supabase.from('veiculos').select('marca');
            if (data) {
                const uniqueBrands = Array.from(new Set(data.map(v => v.marca))).sort();
                setAvailableBrands(uniqueBrands);
            }
        };
        fetchBrands();
    }, []);

    if (availableBrands.length === 0) return null;

    const BrandItem = ({ brand }: { brand: string }) => {
        const logoUrl = findLogoUrl(brand);
        const [imgError, setImgError] = useState(false);

        return (
            <Link
                to={`/estoque?brand=${brand}`}
                className="brand-logo-item"
            >
                {logoUrl && !imgError ? (
                    <img
                        src={logoUrl}
                        alt={brand}
                        className="h-12 w-auto object-contain dark:invert"
                        draggable="false"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <span className="font-black text-xl uppercase italic text-slate-500 dark:text-white whitespace-nowrap">
                        {brand}
                    </span>
                )}
            </Link>
        );
    };

    return (
        <div
            className="brand-carousel-container"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
        >
            <div className="brand-carousel-header">
                <p>Nossas Marcas</p>
            </div>

            <div className="brand-carousel-wrapper">
                <div className={`brand-carousel-track ${isPaused ? 'paused' : ''}`}>
                    {/* First copy */}
                    {availableBrands.map((brand, i) => (
                        <BrandItem key={`set1-${brand}-${i}`} brand={brand} />
                    ))}
                    {/* Second copy for seamless loop */}
                    {availableBrands.map((brand, i) => (
                        <BrandItem key={`set2-${brand}-${i}`} brand={brand} />
                    ))}
                </div>
            </div>

            <style>{`
                .brand-carousel-container {
                    width: 100%;
                    background: rgb(248 250 252);
                    padding: 3rem 0;
                    border-top: 1px solid rgb(226 232 240);
                    border-bottom: 1px solid rgb(226 232 240);
                    overflow: hidden;
                }
                
                .dark .brand-carousel-container {
                    background: rgba(0, 0, 0, 0.2);
                    border-color: rgba(255, 255, 255, 0.05);
                }
                
                .brand-carousel-header {
                    max-width: 80rem;
                    margin: 0 auto 2rem;
                    padding: 0 1rem;
                    text-align: center;
                }
                
                .brand-carousel-header p {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.3em;
                    font-weight: 900;
                    color: rgb(148 163 184);
                }
                
                .brand-carousel-wrapper {
                    overflow: hidden;
                    width: 100%;
                }
                
                .brand-carousel-track {
                    display: flex;
                    align-items: center;
                    width: max-content;
                    animation: marquee-scroll 40s linear infinite;
                }
                
                .brand-carousel-track.paused {
                    animation-play-state: paused;
                }
                
                .brand-logo-item {
                    flex-shrink: 0;
                    min-width: 160px;
                    padding: 0 3rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    filter: grayscale(100%);
                    opacity: 0.4;
                    transition: all 0.3s ease;
                }
                
                .brand-logo-item:hover {
                    filter: grayscale(0%);
                    opacity: 1;
                    transform: scale(1.1);
                }
                
                @keyframes marquee-scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>
        </div>
    );
};
