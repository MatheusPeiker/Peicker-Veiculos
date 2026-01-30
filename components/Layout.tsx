
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '@/src/assets/logo.png';

const Logo: React.FC<{ isScrolled?: boolean }> = ({ isScrolled = false }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <Link
      to="/"
      className={`flex-shrink-0 flex items-center group transition-all duration-500 ${isScrolled ? 'h-16 md:h-20' : 'h-28 md:h-36'
        }`}
    >
      {!hasError ? (
        <img
          src={logo}
          alt="Fellipe Peicker Veículos"
          className="h-full w-auto object-contain transition-transform group-hover:scale-105 duration-500"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex flex-col -space-y-1">
          <span className="font-display font-black text-xl md:text-2xl dark:text-white leading-none">PEICKER</span>
          <span className="font-display font-bold text-[8px] md:text-[10px] tracking-[0.3em] text-primary uppercase leading-none">VEÍCULOS</span>
        </div>
      )}
    </Link>
  );
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 h-20' : 'bg-transparent h-36'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Logo isScrolled={isScrolled} />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          <div className="flex items-center space-x-8">
            {['Início', 'Estoque', 'Contato'].map((item) => {
              let path = '/';
              if (item === 'Estoque') path = '/estoque';
              else if (item === 'Contato') path = '/contact';

              const isActive = location.pathname === path;
              return (
                <Link
                  key={item}
                  to={path}
                  className={`relative font-bold text-[11px] uppercase tracking-[0.2em] transition-all hover:text-primary ${isActive ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  {item}
                  {isActive && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary animate-scale-x"></span>}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all">
              <span className="material-icons-round text-lg dark:hidden block">dark_mode</span>
              <span className="material-icons-round text-lg hidden dark:block text-primary">light_mode</span>
            </button>

            <Link to="/contact" className="bg-primary text-black font-black py-3 px-8 rounded-xl hover:bg-white hover:scale-105 transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20">
              Fale Conosco
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all">
            <span className="material-icons-round text-lg dark:hidden block">dark_mode</span>
            <span className="material-icons-round text-lg hidden dark:block text-primary">light_mode</span>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white"
          >
            <span className="material-icons-round">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-background-dark border-b border-slate-200 dark:border-white/5 shadow-2xl p-6 flex flex-col gap-4 animate-slide-down">
          {['Início', 'Estoque', 'Contato'].map((item) => {
            let path = '/';
            if (item === 'Estoque') path = '/estoque';
            else if (item === 'Contato') path = '/contact';

            const isActive = location.pathname === path;
            return (
              <Link
                key={item}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-black text-lg uppercase tracking-widest py-3 border-b border-slate-100 dark:border-white/5 ${isActive ? 'text-primary' : 'text-slate-900 dark:text-white'}`}
              >
                {item}
              </Link>
            );
          })}
          <Link
            to="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-primary text-black font-black py-4 rounded-xl text-center uppercase text-xs tracking-widest mt-4"
          >
            Fale Conosco
          </Link>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-background-dark pt-24 pb-12 border-t border-slate-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <Logo />
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-light">
              Elevando a experiência de compra automotiva através de paixão, transparência e uma curadoria dos melhores veículos.
            </p>
          </div>

          <div>
            <h5 className="font-display font-bold mb-8 text-slate-900 dark:text-white uppercase text-[10px] tracking-[0.3em] opacity-50">Navegação</h5>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              <li><Link to="/estoque" className="hover:text-primary transition-colors">Nosso Estoque</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Venda seu Veículo</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Financiamento</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-display font-bold mb-8 text-slate-900 dark:text-white uppercase text-[10px] tracking-[0.3em] opacity-50">Localização</h5>
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm font-medium">
              Rua Chile 578, Timbó - SC - Brasil
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Seg - Sex: 09:00 - 18:00<br />
              Sáb: 09:00 - 13:00
            </p>
          </div>

          <div>
            <h5 className="font-display font-bold mb-8 text-slate-900 dark:text-white uppercase text-[10px] tracking-[0.3em] opacity-50">Atendimento</h5>
            <div className="space-y-4">
              <a href="tel:+5547992212581" className="text-2xl font-black text-slate-900 dark:text-white hover:text-primary transition-colors block leading-none">+55 (47) 99221-2581</a>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/f.p.veiculos/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-[#E1306C] hover:text-white hover:scale-110 transition-all duration-300 text-slate-600 dark:text-slate-400 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/fellipepeickerveiculos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-[#1877F2] hover:text-white hover:scale-110 transition-all duration-300 text-slate-600 dark:text-slate-400 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-100 dark:border-white/5 text-center">
          <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] font-medium mb-2">
            © 2024 Fellipe Peicker Veículos. ONDE A QUALIDADE ENCONTRA A ESTRADA.
          </p>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-medium opacity-50">
            CNPJ: 63.635.777/0001-42
          </p>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-primary selection:text-black">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      {/* Social Floating Buttons Container */}
      <div className="fixed bottom-8 right-8 z-[60] flex items-center gap-4">
        {/* Facebook */}
        <a
          href="https://www.facebook.com/fellipepeickerveiculos"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#1877F2] text-white p-5 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group relative"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
          <span className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-white dark:bg-surface-dark text-slate-900 dark:text-white px-4 py-2 rounded-xl text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-200 dark:border-white/10 uppercase tracking-widest pointer-events-none">Facebook</span>
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/f.p.veiculos/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#E1306C] text-white p-5 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group relative"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-white dark:bg-surface-dark text-slate-900 dark:text-white px-4 py-2 rounded-xl text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-200 dark:border-white/10 uppercase tracking-widest pointer-events-none">Instagram</span>
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/5547992212581"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-5 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all animate-bounce-slow flex items-center justify-center group relative"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
          </svg>
          <span className="absolute bottom-full mb-4 right-0 bg-white dark:bg-surface-dark text-slate-900 dark:text-white px-5 py-3 rounded-2xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl border border-slate-200 dark:border-white/10 uppercase tracking-widest pointer-events-none">Chame agora!</span>
        </a>
      </div>
    </div>
  );
};
