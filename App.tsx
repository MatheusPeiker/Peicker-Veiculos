
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import VehicleDetail from './pages/VehicleDetail';

const AboutPlaceholder = () => (
  <div className="pt-32 pb-24 text-center">
    <h1 className="text-6xl font-display font-black text-primary uppercase italic">SOBRE NÓS</h1>
    <p className="mt-8 text-slate-400">Página em construção. Conheça nosso legado em breve.</p>
  </div>
);

const ContactPlaceholder = () => (
  <div className="pt-32 pb-24 text-center">
    <h1 className="text-6xl font-display font-black text-primary uppercase italic">CONTATO</h1>
    <p className="mt-8 text-slate-400">Página em construção. Entre em contato pelo WhatsApp no botão flutuante.</p>
  </div>
);

import ScrollToTop from './src/components/ScrollToTop';

import Contact from './pages/Contact';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/estoque" element={<Inventory />} />
            <Route path="/vehicle/:id" element={<VehicleDetail />} />
            <Route path="/about" element={<AboutPlaceholder />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
