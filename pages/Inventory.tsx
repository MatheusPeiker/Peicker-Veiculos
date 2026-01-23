
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CARS_DATA } from '../constants';

const Inventory: React.FC = () => {
  const [filterBrand, setFilterBrand] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(2000000);

  // Marcas mais vendidas no Brasil + Premium
  const popularBrands = [
    'Volkswagen', 'Fiat', 'Chevrolet', 'Toyota', 'Hyundai', 
    'Honda', 'Jeep', 'Renault', 'Nissan', 'Ford', 
    'Porsche', 'BMW', 'Audi', 'Mercedes-Benz'
  ];

  const filteredCars = useMemo(() => {
    return CARS_DATA.filter(car => {
      const matchesBrand = filterBrand === 'All' || car.brand === filterBrand;
      const matchesSearch = car.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           car.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = car.price <= maxPrice;
      return matchesBrand && matchesSearch && matchesPrice;
    });
  }, [filterBrand, searchTerm, maxPrice]);

  return (
    <div className="pt-32 pb-32 px-4 bg-background-light dark:bg-background-dark min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px] block">Inventory</span>
              <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter italic dark:text-white leading-none">
                ESTOQUE <span className="text-primary">ELITE.</span>
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-light max-w-sm">
              Cada veículo é selecionado individualmente por nossa equipe de especialistas, garantindo o padrão de excelência Peicker.
            </p>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 space-y-8 flex-shrink-0">
            <div className="bg-white dark:bg-surface-dark p-10 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-sm sticky top-28">
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-display font-black text-xl dark:text-white uppercase tracking-tighter italic">Filtros</h2>
                <button 
                  onClick={() => {setFilterBrand('All'); setSearchTerm(''); setMaxPrice(2000000);}} 
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

                {/* Price Range */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                    <span className="material-icons-round text-sm">payments</span> Preço Máximo
                  </h3>
                  <div className="space-y-4">
                    <input 
                      type="range" 
                      min="50000" 
                      max="1500000" 
                      step="10000"
                      className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    />
                    <div className="flex justify-between items-center font-black text-xs dark:text-white">
                      <span className="opacity-50">R$ 50k</span>
                      <span className="text-primary text-sm bg-primary/10 px-3 py-1 rounded-lg">R$ {(maxPrice/1000).toFixed(0)}k</span>
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
            </div>
          </aside>

          {/* Main Grid */}
          <div className="flex-1">
            <div className="bg-white dark:bg-surface-dark px-8 py-6 rounded-3xl border border-slate-200 dark:border-white/5 mb-10 flex items-center justify-between shadow-sm">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">
                Exibindo <span className="text-primary dark:text-white text-sm mx-1">{filteredCars.length}</span> veículos encontrados
              </p>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visualização:</span>
                <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                  <button className="p-2 rounded-lg bg-white dark:bg-white/10 text-primary shadow-sm"><span className="material-icons-round text-sm">grid_view</span></button>
                  <button className="p-2 rounded-lg text-slate-400 hover:text-primary transition-colors"><span className="material-icons-round text-sm">view_list</span></button>
                </div>
              </div>
            </div>

            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredCars.map(car => (
                  <Link 
                    key={car.id} 
                    to={`/vehicle/${car.id}`}
                    className="group bg-white dark:bg-surface-dark rounded-[40px] overflow-hidden border border-slate-200 dark:border-white/5 transition-all hover:border-primary/50 hover:shadow-2xl flex flex-col h-full"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={car.images[0]} alt={car.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-6 right-6 flex flex-col gap-2">
                         <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:text-primary transition-colors">
                           <span className="material-icons-round text-sm">favorite_border</span>
                         </button>
                      </div>
                    </div>
                    <div className="p-10 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{car.brand}</p>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full uppercase">{car.year}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-8 dark:text-white group-hover:text-primary transition-colors line-clamp-1 leading-none">{car.model}</h3>
                      
                      <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-100 dark:border-white/5 mb-8">
                        <div className="flex flex-col items-center">
                          <span className="material-icons-round text-primary text-base mb-1">speed</span>
                          <span className="text-[9px] font-black text-slate-500 uppercase">{car.km}</span>
                        </div>
                        <div className="flex flex-col items-center border-x border-slate-100 dark:border-white/5">
                          <span className="material-icons-round text-primary text-base mb-1">local_gas_station</span>
                          <span className="text-[9px] font-black text-slate-500 uppercase">{car.fuel}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="material-icons-round text-primary text-base mb-1">settings</span>
                          <span className="text-[9px] font-black text-slate-500 uppercase">Auto</span>
                        </div>
                      </div>

                      <div className="mt-auto flex justify-between items-center">
                        <span className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter">R$ {car.price.toLocaleString('pt-BR')}</span>
                        <div className="bg-primary text-black p-3 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                          <span className="material-icons-round text-sm">arrow_forward</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-32 text-center bg-white dark:bg-surface-dark rounded-[40px] border border-dashed border-slate-200 dark:border-white/10">
                <span className="material-icons-round text-6xl text-slate-200 dark:text-white/10 mb-6">search_off</span>
                <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-2">Nenhum veículo encontrado</h3>
                <p className="text-slate-500 text-sm">Tente ajustar seus filtros ou busca.</p>
                <button 
                  onClick={() => {setFilterBrand('All'); setSearchTerm(''); setMaxPrice(2000000);}}
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
