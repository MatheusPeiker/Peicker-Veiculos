
import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { Veiculo } from '../types';

const VehicleDetail: React.FC = () => {
  const { id } = useParams();
  const [car, setCar] = useState<Veiculo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const fetchCar = async () => {
    if (!id) return;
    // Don't set loading true here to avoid flashing content on re-focus
    // setLoading(true);
    const { data, error } = await supabase
      .from('veiculos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching vehicle:', error);
    } else {
      setCar(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCar();

    const handleFocus = () => {
      fetchCar();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        fetchCar();
      }
    });

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-slate-500 font-medium">Carregando detalhes...</p>
      </div>
    );
  }

  if (!car) return <Navigate to="/estoque" />;

  // Parse images from string (newline separated) or array
  const images = React.useMemo(() => {
    if (!car.imagem_url) return [];
    if (Array.isArray(car.imagem_url)) return car.imagem_url;
    // Split by newline or comma to be safe, filter empty strings
    return car.imagem_url.split(/[\n,]/).map(url => url.trim()).filter(url => url.length > 0);
  }, [car.imagem_url]);

  return (
    <div className="pt-32 pb-24 px-4 bg-background-light dark:bg-background-dark min-h-screen">
      <div className="max-w-7xl mx-auto">
        <nav className="flex mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <Link to="/" className="hover:text-primary">Início</Link>
          <span className="mx-2 text-primary">•</span>
          <Link to="/estoque" className="hover:text-primary">Estoque</Link>
          <span className="mx-2 text-primary">•</span>
          <span className="dark:text-white">{car.marca} {car.modelo}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content (Images + Description) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative group">
              <div
                className="aspect-[16/9] rounded-[40px] overflow-hidden bg-slate-200 dark:bg-surface-dark shadow-2xl relative"
              >
                {/* Carousel Container */}
                <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
                  {(images.length > 0 ? images : ['https://placehold.co/800x600?text=Sem+Imagem']).map((img, idx) => (
                    <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                      <img
                        src={img}
                        alt={`${car.modelo} - Foto ${idx + 1}`}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => window.open(img, '_blank')}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=90&w=1200';
                        }}
                      />
                    </div>
                  ))}
                </div>

              </div>
              <div className="absolute bottom-6 right-6 glass-effect text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 flex items-center gap-2 pointer-events-none">
                <span className="material-icons-round text-sm">photo_library</span>
                {images.length} Fotos
              </div>

              {/* Hint for interaction */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Arraste para o lado
                </div>
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      // Find the carousel container and scroll
                      const container = document.querySelector('.snap-x');
                      if (container) {
                        const width = container.clientWidth;
                        container.scrollTo({ left: width * i, behavior: 'smooth' });
                      }
                    }}
                    className={`aspect-video rounded-2xl overflow-hidden border-2 transition-all border-transparent opacity-60 hover:opacity-100 hover:scale-105`}
                  >
                    <img src={img} alt={`${car.modelo} thumbnail ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}


            <div className="bg-white dark:bg-surface-dark p-10 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-sm">
              <h2 className="text-2xl font-display font-black mb-8 dark:text-white uppercase italic tracking-tighter flex items-center gap-4">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                Ficha Técnica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16">
                {[
                  { label: 'Modelo', value: car.modelo },
                  { label: 'Marca', value: car.marca },
                  { label: 'Ano', value: car.ano },
                  { label: 'KM', value: car.quilometragem || '0 km' },
                  { label: 'Câmbio', value: car.cambio },
                  { label: 'Combustível', value: car.combustivel },
                  { label: 'Tipo', value: car.tipo },
                  // Add more fields if available in DB
                ].map((item, i) => (
                  <div key={i} className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.label}</span>
                    <span className="font-bold dark:text-white text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-surface-dark p-10 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-sm">
              <h2 className="text-2xl font-display font-black mb-6 dark:text-white uppercase italic tracking-tighter flex items-center gap-4">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                Descrição
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-light text-lg">
                Veículo {car.marca} {car.modelo} ano {car.ano}, disponível para venda.
                Entre em contato para mais detalhes sobre este {car.tipo}.
                {/* Ensure description fallback if not in DB */}
              </p>
            </div>
          </div>

          {/* Sidebar (Price + CTAs) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white dark:bg-surface-dark p-10 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-2xl">
                <div className="mb-8">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] block mb-2">Preço à vista</span>
                  <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 leading-none uppercase italic tracking-tighter">{car.modelo}</h1>
                  <span className="text-5xl font-black text-primary drop-shadow-[0_2px_10px_rgba(242,255,0,0.3)] block mt-4">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.preco)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="bg-slate-50 dark:bg-background-dark p-4 rounded-3xl text-center border border-transparent hover:border-primary/20 transition-all">
                    <span className="material-icons-round text-primary text-lg block mb-1">calendar_today</span>
                    <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Ano</p>
                    <p className="font-black text-xs dark:text-white">{car.ano}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-background-dark p-4 rounded-3xl text-center border border-transparent hover:border-primary/20 transition-all">
                    <span className="material-icons-round text-primary text-lg block mb-1">speed</span>
                    <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Km</p>
                    <p className="font-black text-xs dark:text-white">{car.quilometragem}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-background-dark p-4 rounded-3xl text-center border border-transparent hover:border-primary/20 transition-all">
                    <span className="material-icons-round text-primary text-lg block mb-1">local_gas_station</span>
                    <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Combust.</p>
                    <p className="font-black text-xs dark:text-white">{car.combustivel}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const message = encodeURIComponent(`Olá, tenho interesse no veículo ${car.marca} ${car.modelo} - ${car.ano}`);
                    window.open(`https://wa.me/5547992212581?text=${message}`, '_blank');
                  }}
                  className="w-full bg-primary text-black py-6 rounded-2xl font-black text-base flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest mb-4"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                  </svg>
                  TENHO INTERESSE
                </button>
              </div>

              <div className="bg-slate-100 dark:bg-surface-dark p-8 rounded-[40px] border border-slate-200 dark:border-white/5 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Fale com um consultor</p>
                <div className="flex justify-center -space-x-4 mb-6">
                  {[1, 2, 3].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/consultant${i}/100/100`} className="w-12 h-12 rounded-full border-4 border-white dark:border-surface-dark shadow-lg" alt="Consultant" />
                  ))}
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-black border-4 border-white dark:border-surface-dark shadow-lg">+2</div>
                </div>
                <p className="text-xl font-black dark:text-white">(47) 99221-2581</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default VehicleDetail;
