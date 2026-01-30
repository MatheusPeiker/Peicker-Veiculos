import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import chevroletLogo from '@/src/assets/logos/chevrolet.png';
import citroenLogo from '@/src/assets/logos/citroen.png';
import jeepLogo from '@/src/assets/logos/jeep.png';
import hyundaiLogo from '@/src/assets/logos/hyundai.png';
import renaultLogo from '@/src/assets/logos/renault.svg';
import mitsubishiLogo from '@/src/assets/logos/mitsubishi.png';
import fordLogo from '@/src/assets/logos/ford.svg';

// Extended brand logos with multiple name variations
// Extended brand logos with multiple name variations
const BRAND_LOGOS: Record<string, string> = {
    // Common variations
    'fiat': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Fiat_Automobiles_logo.svg/2048px-Fiat_Automobiles_logo.svg.png',
    'volkswagen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/2048px-Volkswagen_logo_2019.svg.png',
    'vw': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/2048px-Volkswagen_logo_2019.svg.png',
    'volks': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/2048px-Volkswagen_logo_2019.svg.png',
    'chevrolet': chevroletLogo,
    'gm': chevroletLogo,
    'renault': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/renault.svg',
    'hyundai': hyundaiLogo,
    'ford': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/ford.svg',
    'toyota': 'https://logo.clearbit.com/toyota.com',
    'honda': 'https://logo.clearbit.com/honda.com',
    'jeep': jeepLogo,
    'nissan': 'https://logo.clearbit.com/nissan.com',
    'mitsubishi': mitsubishiLogo,
    'bmw': 'https://logo.clearbit.com/bmw.com',
    'mercedesbenz': 'https://logo.clearbit.com/mercedes-benz.com',
    'mercedes': 'https://logo.clearbit.com/mercedes-benz.com',
    'audi': 'https://logo.clearbit.com/audi.com',
    'kia': 'https://logo.clearbit.com/kia.com',
    'citroen': citroenLogo,
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

const BrandItem: React.FC<{ brand: string }> = ({ brand }) => {
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

export const BrandCarousel: React.FC = () => {
    const [availableBrands, setAvailableBrands] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const pauseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchBrands = async () => {
            const { data } = await supabase.from('veiculos').select('marca');
            if (data) {
                const uniqueBrands = Array.from(new Set(data.map(v => {
                    const brand = v.marca || '';
                    if (!brand) return '';

                    const trimmed = brand.trim();
                    const lower = trimmed.toLowerCase();
                    const acronyms = ['bmw', 'vw', 'gm', 'byd', 'gwm', 'ram', 'jac', 'jlr'];

                    if (acronyms.includes(lower)) {
                        return lower.toUpperCase();
                    }

                    return lower.charAt(0).toUpperCase() + lower.slice(1);
                }))).filter(Boolean).sort();
                setAvailableBrands(uniqueBrands);
            }
        };
        fetchBrands();
    }, []);

    // Autoplay logic
    useEffect(() => {
        if (!isAutoPlaying || isPaused || availableBrands.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % availableBrands.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, isPaused, availableBrands.length]);

    const handleUserInteraction = () => {
        setIsAutoPlaying(false);

        // Clear existing timeout
        if (pauseTimeoutRef.current) {
            clearTimeout(pauseTimeoutRef.current);
        }

        // Resume after 5 seconds of inactivity
        pauseTimeoutRef.current = setTimeout(() => {
            setIsAutoPlaying(true);
        }, 5000);
    };

    const handlePrev = () => {
        handleUserInteraction();
        setCurrentIndex(prev => (prev - 1 + availableBrands.length) % availableBrands.length);
    };

    const handleNext = () => {
        handleUserInteraction();
        setCurrentIndex(prev => (prev + 1) % availableBrands.length);
    };

    const handleDotClick = (index: number) => {
        handleUserInteraction();
        setCurrentIndex(index);
    };

    if (availableBrands.length === 0) return null;

    // Calculate visible brands (show 5 at a time, centered on current)
    const getVisibleBrands = () => {
        const visibleCount = 5;
        const brands = [];
        for (let i = -2; i <= 2; i++) {
            const index = (currentIndex + i + availableBrands.length) % availableBrands.length;
            brands.push({ brand: availableBrands[index], offset: i, index });
        }
        return brands;
    };

    const visibleBrands = getVisibleBrands();

    return (
        <div
            className="brand-carousel-container"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="brand-carousel-header">
                <p>Nossas Marcas</p>
            </div>

            <div className="brand-carousel-wrapper">
                {/* Previous Button */}
                <button
                    onClick={handlePrev}
                    className="carousel-nav-button carousel-nav-prev"
                    aria-label="Marca anterior"
                >
                    <span className="material-icons-round">chevron_left</span>
                </button>

                {/* Brands Track */}
                <div className="brand-carousel-track-container">
                    <div className="brand-carousel-track">
                        {visibleBrands.map(({ brand, offset, index }) => (
                            <div
                                key={`${brand}-${index}`}
                                className={`brand-logo-item ${offset === 0 ? 'active' : ''}`}
                                style={{
                                    transform: `translateX(${offset * 200}px) scale(${offset === 0 ? 1.2 : 0.8})`,
                                    opacity: offset === 0 ? 1 : 0.4,
                                    zIndex: offset === 0 ? 10 : 1
                                }}
                                onClick={() => handleDotClick(index)}
                            >
                                <BrandItem brand={brand} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    className="carousel-nav-button carousel-nav-next"
                    aria-label="Próxima marca"
                >
                    <span className="material-icons-round">chevron_right</span>
                </button>
            </div>

            {/* Progress Indicators */}
            <div className="carousel-dots">
                {availableBrands.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                        aria-label={`Ir para ${availableBrands[index]}`}
                    />
                ))}
            </div>

            <style>{`
                .brand-carousel-container {
                    width: 100%;
                    background: rgb(248 250 252);
                    padding: 3rem 0;
                    border-top: 1px solid rgb(226 232 240);
                    border-bottom: 1px solid rgb(226 232 240);
                    overflow: hidden;
                    position: relative;
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
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 2rem;
                    padding: 0 4rem;
                }

                .brand-carousel-track-container {
                    flex: 1;
                    max-width: 1000px;
                    height: 120px;
                    position: relative;
                    overflow: hidden;
                }

                .brand-carousel-track {
                    position: relative;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .brand-logo-item {
                    position: absolute;
                    min-width: 160px;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }

                .brand-logo-item:not(.active) {
                    filter: grayscale(100%);
                }

                .brand-logo-item.active {
                    filter: grayscale(0%);
                }

                .brand-logo-item:hover {
                    filter: grayscale(0%) !important;
                    transform: scale(1.1) !important;
                }

                .brand-logo-item a {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                }

                .carousel-nav-button {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.9);
                    border: 1px solid rgb(226 232 240);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                    z-index: 20;
                }

                .dark .carousel-nav-button {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .carousel-nav-button:hover {
                    background: #F2FF00;
                    border-color: #F2FF00;
                    transform: scale(1.1);
                }

                .dark .carousel-nav-button:hover {
                    background: #F2FF00;
                    border-color: #F2FF00;
                }

                .carousel-nav-button span {
                    font-size: 24px;
                    color: rgb(71 85 105);
                }

                .dark .carousel-nav-button span {
                    color: white;
                }

                .carousel-nav-button:hover span {
                    color: black;
                }

                .carousel-dots {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 2rem;
                    padding: 0 1rem;
                }

                .carousel-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: rgb(203 213 225);
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    padding: 0;
                }

                .dark .carousel-dot {
                    background: rgba(255, 255, 255, 0.2);
                }

                .carousel-dot:hover {
                    background: rgb(148 163 184);
                    transform: scale(1.2);
                }

                .carousel-dot.active {
                    background: #F2FF00;
                    width: 24px;
                    border-radius: 4px;
                }

                @media (max-width: 768px) {
                    .brand-carousel-wrapper {
                        padding: 0 1rem;
                    }

                    .carousel-nav-button {
                        width: 40px;
                        height: 40px;
                    }

                    .carousel-nav-button span {
                        font-size: 20px;
                    }

                    .brand-carousel-track-container {
                        max-width: 600px;
                    }
                }
            `}</style>
        </div>
    );
};
