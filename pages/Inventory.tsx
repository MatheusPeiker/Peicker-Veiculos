import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { Veiculo } from '../types';

const Inventory: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('inventoryViewMode') as 'grid' | 'list') || 'grid';
  });

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('inventoryViewMode', mode);
  };

  // Helper for consistent brand casing
  const capitalize = (str: string) => {
    if (!str) return '';
    const trimmed = str.trim();
    const lower = trimmed.toLowerCase();

    // Acronyms that should remain uppercase
    const acronyms = ['bmw', 'vw', 'gm', 'byd', 'gwm', 'ram', 'jac', 'jlr'];
    if (acronyms.includes(lower)) {
      return lower.toUpperCase();
    }

    // Title Case for others
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const [filterBrand, setFilterBrand] = useState<string>(capitalize(searchParams.get('brand') || 'All'));
  const [filterFuel, setFilterFuel] = useState<string>('All');
  const [filterTransmission, setFilterTransmission] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(500000);

  // Fetch data from Supabase
  const fetchCars = async () => {
    const { data, error } = await supabase
      .from('veiculos')
      .select('*');

    if (error) {
      console.error('Error fetching vehicles:', error);
    } else {
      setCars(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();

    const handleFocus = () => {
      fetchCars();
    };

    window.addEventListener('focus', handleFocus);
    // Also listen for visibility change (e.g. switching tabs without losing window focus in some browsers)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        fetchCars();
      }
    });

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  // Update filter if URL param changes
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    console.log('Brand param changed:', brandParam);
    if (brandParam) {
      setFilterBrand(capitalize(brandParam));
    } else {
      // Optional: if no brand param, maybe reset? defaulting to keeping current or All
      // searchParams.get('brand') || 'All' handled initial state, but explicit 'All' navigation logic?
    }
  }, [searchParams]);

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesBrand = filterBrand === 'All' || (car.marca && car.marca.trim().toLowerCase() === filterBrand.toLowerCase());
      const matchesFuel = filterFuel === 'All' ||
        (filterFuel === 'Gasolina/Flex' ? (car.combustivel === 'Gasolina' || car.combustivel === 'Flex') : car.combustivel === filterFuel);
      const matchesTransmission = filterTransmission === 'All' || car.cambio === filterTransmission;
      const matchesType = filterType === 'All' || car.tipo.toLowerCase() === filterType.toLowerCase();
      const matchesSearch = car.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.marca.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = car.preco <= maxPrice;
      return matchesBrand && matchesSearch && matchesPrice && matchesFuel && matchesTransmission && matchesType;
    });
  }, [cars, filterBrand, searchTerm, maxPrice, filterFuel, filterTransmission, filterType]);

  // Unique brands from actual data or defaults
  // Normalize brands from DB to capitalize first letter to ensure consistent filter buttons
  const uniqueBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    cars.forEach(c => {
      if (c.marca) brandsSet.add(capitalize(c.marca));
    });
    return Array.from(brandsSet).sort();
  }, [cars]);

  // Ensure we have at least the popular default ones if DB is empty to show layout structure
  const popularBrands = uniqueBrands.length > 0 ? uniqueBrands : [
    'Volkswagen', 'Fiat', 'Chevrolet', 'Toyota', 'Hyundai',
    'Honda', 'Jeep', 'Renault', 'Nissan', 'Ford',
    'Mitsubishi', 'Troller'
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <div className="pt-32 pb-32 px-4 bg-background-light dark:bg-background-dark min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* ... header ... */}

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className={`
            lg:w-80 space-y-8 flex-shrink-0
            ${showMobileFilters
              ? 'fixed inset-0 z-[100] bg-white dark:bg-background-dark p-6 overflow-y-auto animate-fade-in'
              : 'hidden lg:block'}
          `}>
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between mb-6">
              <h2 className="font-display font-black text-xl dark:text-white uppercase tracking-tighter italic">Filtros</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white"
              >
                <span className="material-icons-round">close</span>
              </button>
            </div>

            <div className="bg-white dark:bg-surface-dark lg:p-10 rounded-[40px] lg:border border-slate-200 dark:border-white/5 lg:shadow-sm lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto custom-scrollbar">
              <div className="hidden lg:flex items-center justify-between mb-10">
                <h2 className="font-display font-black text-xl dark:text-white uppercase tracking-tighter italic">Filtros</h2>
                <button
                  onClick={() => {
                    setFilterBrand('All');
                    setSearchTerm('');
                    setMaxPrice(500000);
                    setFilterFuel('All');
                    setFilterTransmission('All');
                    setFilterType('All');
                    setShowMobileFilters(false);
                  }}
                  className="text-[10px] text-slate-400 hover:text-primary uppercase font-black tracking-widest transition-colors"
                >
                  Limpar Tudo
                </button>
              </div>

              <div className="space-y-10">
                {/* Search */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                    <span className="material-icons-round text-sm">search</span> Busca Rápida
                  </h3>
                  <input
                    type="text"
                    placeholder="Modelo, marca ou ano..."
                    className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-5 transition-all outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Vehicle Type Filter */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                    <span className="material-icons-round text-sm">directions_car</span> Tipo
                  </h3>
                  <div className="flex gap-2">
                    {['All', 'Carro', 'Moto'].map(type => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all border uppercase tracking-widest ${filterType === type ? 'bg-primary text-black border-primary' : 'bg-slate-50 dark:bg-white/5 dark:text-slate-400 border-transparent hover:border-primary/30'}`}
                      >
                        {type === 'All' ? 'Todos' : type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transmission Filter */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                    <span className="material-icons-round text-sm">settings</span> Câmbio
                  </h3>
                  <div className="flex gap-2">
                    {['All', 'Automático', 'Manual'].map(trans => (
                      <button
                        key={trans}
                        onClick={() => setFilterTransmission(trans)}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all border uppercase tracking-widest ${filterTransmission === trans ? 'bg-primary text-black border-primary' : 'bg-slate-50 dark:bg-white/5 dark:text-slate-400 border-transparent hover:border-primary/30'}`}
                      >
                        {trans === 'All' ? 'Todos' : trans}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fuel Filter */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                    <span className="material-icons-round text-sm">local_gas_station</span> Combustível
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['All', 'Gasolina', 'Flex', 'Diesel', 'Elétrico'].map(fuel => (
                      <button
                        key={fuel}
                        onClick={() => setFilterFuel(fuel)}
                        className={`py-3 rounded-xl text-[10px] font-black transition-all border uppercase tracking-widest ${filterFuel === fuel ? 'bg-primary text-black border-primary' : 'bg-slate-50 dark:bg-white/5 dark:text-slate-400 border-transparent hover:border-primary/30'}`}
                      >
                        {fuel === 'All' ? 'Todos' : fuel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                    <span className="material-icons-round text-sm">payments</span> Preço Máximo
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="10000"
                      max="500000"
                      step="10000"
                      className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    />
                    <div className="flex justify-between items-center font-black text-xs dark:text-white">
                      <span className="opacity-50">R$ 10k</span>
                      <span className="text-primary text-sm bg-primary/10 px-3 py-1 rounded-lg">R$ {(maxPrice / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                </div>

                {/* Brands Grid */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                    <span className="material-icons-round text-sm">loyalty</span> Marcas
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFilterBrand('All')}
                      className={`px-4 py-3 rounded-xl text-[10px] font-black transition-all border uppercase tracking-widest ${filterBrand === 'All' ? 'bg-primary text-black border-primary' : 'bg-slate-50 dark:bg-white/5 dark:text-slate-400 border-transparent hover:border-primary/30'}`}
                    >
                      Todas
                    </button>
                    {popularBrands.map(brand => (
                      <button
                        key={brand}
                        onClick={() => setFilterBrand(brand)}
                        className={`px-4 py-3 rounded-xl text-[10px] font-black transition-all border uppercase tracking-widest ${filterBrand === brand ? 'bg-primary text-black border-primary' : 'bg-slate-50 dark:bg-white/5 dark:text-slate-400 border-transparent hover:border-primary/30'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Apply Button */}
              <div className="lg:hidden mt-8 pt-4 border-t border-slate-100 dark:border-white/5">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-primary text-black font-black py-4 rounded-xl uppercase tracking-widest"
                >
                  Ver {filteredCars.length} Veículos
                </button>
              </div>
            </div>
          </aside>

          {/* Main Grid */}
          <div className="flex-1">
            <div className="bg-white dark:bg-surface-dark px-8 py-6 rounded-3xl border border-slate-200 dark:border-white/5 mb-10 flex items-center justify-between shadow-sm">
              <p className="hidden md:block text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">
                Exibindo <span className="text-primary dark:text-white text-sm mx-1">{filteredCars.length}</span> veículos encontrados
              </p>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center gap-2 bg-slate-100 dark:bg-white/5 py-2 px-4 rounded-xl text-slate-900 dark:text-white font-bold text-xs uppercase tracking-widest"
              >
                <span className="material-icons-round text-primary">filter_list</span>
                Filtros
              </button>

              <div className="flex items-center gap-4">
                <span className="hidden md:inline text-[10px] font-black text-slate-400 uppercase tracking-widest">Visualização:</span>
                <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                  <button
                    onClick={() => handleViewModeChange('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-white/10 text-primary shadow-sm' : 'text-slate-400 hover:text-primary'}`}
                  >
                    <span className="material-icons-round text-sm">grid_view</span>
                  </button>
                  <button
                    onClick={() => handleViewModeChange('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-white/10 text-primary shadow-sm' : 'text-slate-400 hover:text-primary'}`}
                  >
                    <span className="material-icons-round text-sm">view_list</span>
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="py-32 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                <p className="text-slate-500 font-medium">Carregando estoque...</p>
              </div>
            ) : filteredCars.length > 0 ? (
              <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredCars.map(car => (
                  <Link
                    key={car.id}
                    to={`/vehicle/${car.id}`}
                    className={`group bg-white dark:bg-surface-dark rounded-[40px] overflow-hidden border border-slate-200 dark:border-white/5 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl flex ${viewMode === 'list' ? 'flex-col md:flex-row h-auto md:h-64' : 'flex-col h-full'}`}
                  >
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-full md:w-80 h-64 md:h-full flex-shrink-0' : 'aspect-[4/3]'}`}>
                      <img
                        src={(() => {
                          if (!car.imagem_url) return 'https://placehold.co/600x400?text=Sem+Imagem';
                          if (Array.isArray(car.imagem_url)) return car.imagem_url[0] || 'https://placehold.co/600x400?text=Sem+Imagem';
                          const firstUrl = car.imagem_url.split(/[\r\n,]+/)[0]?.trim();
                          return firstUrl || 'https://placehold.co/600x400?text=Sem+Imagem';
                        })()}
                        alt={car.modelo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-6 right-6 flex flex-col gap-2">
                        <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:text-primary transition-colors">
                          <span className="material-icons-round text-sm">favorite_border</span>
                        </button>
                      </div>
                    </div>
                    <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{car.marca}</p>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full uppercase">{car.ano}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-4 dark:text-white group-hover:text-primary transition-colors leading-none">{car.modelo}</h3>

                        <div className={`grid border-y border-slate-100 dark:border-white/5 py-4 mb-4 ${viewMode === 'list' ? 'grid-cols-3 gap-6 w-full md:w-3/4' : 'grid-cols-3 gap-4'}`}>
                          <div className="flex flex-col items-center">
                            <span className="material-icons-round text-primary text-base mb-1">speed</span>
                            <span className="text-[9px] font-black text-slate-500 uppercase">{car.quilometragem}</span>
                          </div>
                          <div className="flex flex-col items-center border-x border-slate-100 dark:border-white/5">
                            <span className="material-icons-round text-primary text-base mb-1">local_gas_station</span>
                            <span className="text-[9px] font-black text-slate-500 uppercase">{car.combustivel}</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="material-icons-round text-primary text-base mb-1">settings</span>
                            <span className="text-[9px] font-black text-slate-500 uppercase">{car.cambio === 'Automático' ? 'Auto' : 'Manual'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter">{formatPrice(car.preco)}</span>
                        <div className="bg-primary text-black p-3 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                          <span className="material-icons-round text-sm">arrow_forward</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              // ... Empty state ...
              <div className="py-32 text-center bg-white dark:bg-surface-dark rounded-[40px] border border-dashed border-slate-200 dark:border-white/10">
                <span className="material-icons-round text-6xl text-slate-200 dark:text-white/10 mb-6">search_off</span>
                <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-2">Nenhum veículo encontrado</h3>
                <p className="text-slate-500 text-sm">Tente ajustar seus filtros ou busca.</p>
                <button
                  onClick={() => { setFilterBrand('All'); setSearchTerm(''); setMaxPrice(500000); }}
                  className="mt-8 bg-primary text-black font-black py-4 px-10 rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
                >
                  Resetar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
