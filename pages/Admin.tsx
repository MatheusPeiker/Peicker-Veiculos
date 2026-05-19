import React, { useState } from 'react';
import { supabase } from '../src/lib/supabase';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    preco: '',
    quilometragem: '',
    cambio: 'Automático',
    combustivel: 'Gasolina',
    tipo: 'Carro',
    imagem_url: '',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'peicker2024') { // Senha simples para demonstração
      setIsAuthenticated(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Senha incorreta.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const { error } = await supabase.from('veiculos').insert([
        {
          marca: formData.marca,
          modelo: formData.modelo,
          ano: formData.ano,
          preco: parseFloat(formData.preco),
          quilometragem: formData.quilometragem,
          cambio: formData.cambio,
          combustivel: formData.combustivel,
          tipo: formData.tipo,
          imagem_url: formData.imagem_url,
        },
      ]);

      if (error) {
        throw error;
      }

      setSuccessMessage('Veículo adicionado com sucesso!');
      setFormData({
        marca: '',
        modelo: '',
        ano: '',
        preco: '',
        quilometragem: '',
        cambio: 'Automático',
        combustivel: 'Gasolina',
        tipo: 'Carro',
        imagem_url: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao adicionar veículo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4">
        <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-2xl max-w-md w-full">
          <h2 className="text-3xl font-display font-black text-center mb-6 dark:text-white uppercase italic">Área Restrita</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Senha de Acesso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white"
                placeholder="Insira a senha"
                required
              />
            </div>
            {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
            <button
              type="submit"
              className="w-full bg-primary text-black font-black py-4 rounded-xl uppercase tracking-widest hover:scale-[1.02] transition-transform"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background-light dark:bg-background-dark px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
              Administração
            </h1>
            <p className="text-slate-500 font-medium mt-2">Gerencie o estoque de veículos.</p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-[10px] text-slate-400 hover:text-red-500 uppercase font-black tracking-widest transition-colors flex items-center gap-2"
          >
            <span className="material-icons-round text-sm">logout</span> Sair
          </button>
        </div>

        <div className="bg-white dark:bg-surface-dark p-8 md:p-12 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-xl">
          <h2 className="text-2xl font-black mb-8 dark:text-white uppercase italic">Adicionar Novo Veículo</h2>
          
          {successMessage && (
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-2xl mb-8 flex items-center gap-3">
              <span className="material-icons-round">check_circle</span>
              <p className="font-bold text-sm">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-2xl mb-8 flex items-center gap-3">
              <span className="material-icons-round">error</span>
              <p className="font-bold text-sm">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Marca</label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleInputChange}
                  className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white"
                  placeholder="Ex: Porsche"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Modelo</label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleInputChange}
                  className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white"
                  placeholder="Ex: 911 Carrera S"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Ano</label>
                <input
                  type="text"
                  name="ano"
                  value={formData.ano}
                  onChange={handleInputChange}
                  className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white"
                  placeholder="Ex: 2022/2023"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Preço (R$)</label>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleInputChange}
                  className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white"
                  placeholder="Ex: 850000"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Quilometragem</label>
                <input
                  type="text"
                  name="quilometragem"
                  value={formData.quilometragem}
                  onChange={handleInputChange}
                  className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white"
                  placeholder="Ex: 15.000 km"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Câmbio</label>
                <select
                  name="cambio"
                  value={formData.cambio}
                  onChange={handleInputChange}
                  className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white appearance-none"
                >
                  <option value="Automático">Automático</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Combustível</label>
                <select
                  name="combustivel"
                  value={formData.combustivel}
                  onChange={handleInputChange}
                  className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white appearance-none"
                >
                  <option value="Gasolina">Gasolina</option>
                  <option value="Flex">Flex</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Elétrico">Elétrico</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Tipo</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white appearance-none"
                >
                  <option value="Carro">Carro</option>
                  <option value="Moto">Moto</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">URLs das Imagens (uma por linha)</label>
              <textarea
                name="imagem_url"
                value={formData.imagem_url}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white custom-scrollbar resize-none"
                placeholder="https://exemplo.com/imagem1.jpg&#10;https://exemplo.com/imagem2.jpg"
              ></textarea>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-primary text-black font-black py-4 px-10 rounded-xl uppercase tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <span className="material-icons-round text-sm">add_circle</span> Adicionar Veículo
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
