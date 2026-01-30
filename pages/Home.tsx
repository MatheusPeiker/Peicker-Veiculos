
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { Veiculo } from '../types';
import { BrandCarousel } from '../components/BrandCarousel';

const Home: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<Veiculo[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .limit(3)
        .order('id', { ascending: false }); // Show newest added cars as featured

      if (error) {
        console.error('Error fetching featured cars:', error);
      } else {
        setFeaturedCars(data || []);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img
            alt="Fellipe Peicker Veículos Destaque"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
            src="hero-car.jpg"
            onError={(e) => {
              // Caso o arquivo local não exista, usa uma imagem genérica de carro de luxo
              e.currentTarget.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=90&w=2400";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl py-20">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black text-white mb-10 leading-tight uppercase tracking-tighter animate-fade-in-up">
            ONDE A QUALIDADE ENCONTRA A ESTRADA. <br />
            <span className="text-primary italic">SEU PRÓXIMO VEÍCULO ESTÁ AQUI.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-200 mb-14 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200">
            Explore nosso estoque: <br className="hidden md:block" />
            <span className="font-medium text-white italic">Onde cada detalhe foi revisado para sua total tranquilidade.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-300">
            <Link to="/estoque" className="bg-primary text-black font-black py-6 px-16 rounded-2xl text-sm hover:scale-105 transition-all flex items-center justify-center gap-3 uppercase shadow-2xl shadow-primary/30">
              EXPLORAR ESTOQUE <span className="material-icons-round">explore</span>
            </Link>
            <Link to="/contact" className="glass-effect text-white border border-white/20 font-bold py-6 px-16 rounded-2xl text-sm hover:bg-white/10 transition-all uppercase tracking-widest">
              FALE CONOSCO
            </Link>
          </div>
        </div>
      </section>

      <BrandCarousel />

      {/* Featured Section */}
      <section className="py-32 px-4 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20">
            <div className="space-y-4">
              <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px] block">Destaques</span>
              <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                SÓ O <span className="text-primary">MELHOR.</span>
              </h2>
            </div>
            <Link to="/estoque" className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest border-b-2 border-primary pb-2 hover:text-primary transition-all mt-8 md:mt-0">
              Ver Catálogo Completo <span className="material-icons-round group-hover:translate-x-2 transition-transform">east</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredCars.map(car => (
              <Link
                key={car.id}
                to={`/vehicle/${car.id}`}
                className="group bg-slate-50 dark:bg-surface-dark rounded-[40px] overflow-hidden border border-slate-200 dark:border-white/5 transition-all hover:border-primary/50 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={(() => {
                      // Extract first valid image URL
                      if (!car.imagem_url) return 'https://placehold.co/600x400?text=Sem+Imagem';
                      if (Array.isArray(car.imagem_url)) return car.imagem_url[0] || 'https://placehold.co/600x400?text=Sem+Imagem';
                      // Split by newline or comma, get first trimmed URL
                      const firstUrl = car.imagem_url.split(/[\r\n,]+/)[0]?.trim();
                      return firstUrl || 'https://placehold.co/600x400?text=Sem+Imagem';
                    })()}
                    alt={car.modelo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=90&w=800';
                      e.currentTarget.onerror = null;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Clique para ver detalhes</span>
                  </div>
                  {/* Assumption: All featured are treated as 'new-ish' or we remove the NEW tag if no field */}
                  {String(car.ano).includes(new Date().getFullYear().toString()) && (
                    <div className="absolute top-6 left-6 bg-primary text-black text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">Novo</div>
                  )}
                </div>
                <div className="p-10">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">{car.marca}</p>
                  <h3 className="text-2xl font-bold mb-6 dark:text-white group-hover:text-primary transition-colors leading-none tracking-tight">{car.modelo}</h3>
                  <div className="flex justify-between items-center mb-8 py-5 border-y border-slate-200 dark:border-white/5">
                    <div className="flex flex-col items-center">
                      <span className="material-icons-round text-primary text-lg mb-1">speed</span>
                      <span className="text-[10px] font-black text-slate-500 uppercase">{car.quilometragem}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="material-icons-round text-primary text-lg mb-1">local_gas_station</span>
                      <span className="text-[10px] font-black text-slate-500 uppercase">{car.combustivel}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="material-icons-round text-primary text-lg mb-1">calendar_today</span>
                      <span className="text-[10px] font-black text-slate-500 uppercase">{car.ano}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.preco)}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                      <span className="material-icons-round">north_east</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default Home;
