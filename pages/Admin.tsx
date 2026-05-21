import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { Veiculo } from '../types';

const Admin: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [vehicles, setVehicles] = useState<Veiculo[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    preco: '',
    quilometragem: '',
    cambio: 'Automático',
    combustivel: 'Gasolina',
    tipo: 'Carro',
    imagem_url: '', // Fallback if they want to paste a URL instead
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchVehicles();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchVehicles();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchVehicles = async () => {
    setLoadingVehicles(true);
    const { data, error } = await supabase.from('veiculos').select('*').order('id', { ascending: false });
    if (!error) {
      setVehicles(data || []);
    }
    setLoadingVehicles(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError('Credenciais inválidas.');
      setAuthLoading(false);
      return;
    }

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    if (!adminEmail || data.session?.user?.email !== adminEmail) {
      await supabase.auth.signOut();
      setAuthError('Acesso não autorizado para esta conta.');
      setAuthLoading(false);
      return;
    }

    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setErrorMessage(`"${file.name}": formato não permitido. Use JPG, PNG, WebP ou GIF.`);
        e.target.value = '';
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setErrorMessage(`"${file.name}": arquivo muito grande. Máximo 5MB por imagem.`);
        e.target.value = '';
        return;
      }
    }

    setImageFiles(files);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      let finalImageUrl = formData.imagem_url;

      if (imageFiles.length > 0) {
        const uploadedUrls: string[] = [];

        for (const file of imageFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('veiculos-imagens')
            .upload(fileName, file);

          if (uploadError) {
            throw new Error(`Erro ao fazer upload de "${file.name}": ${uploadError.message}`);
          }

          const { data: publicUrlData } = supabase.storage
            .from('veiculos-imagens')
            .getPublicUrl(fileName);

          uploadedUrls.push(publicUrlData.publicUrl);
        }

        // Combine uploaded URLs with any manually typed URLs
        const manualUrls = formData.imagem_url.trim();
        finalImageUrl = manualUrls
          ? [...uploadedUrls, manualUrls].join('\n')
          : uploadedUrls.join('\n');
      }

      const price = parseFloat(formData.preco);
      if (isNaN(price) || price < 0 || price > 10000000) {
        throw new Error('Preço inválido.');
      }

      const { error } = await supabase.from('veiculos').insert([
        {
          marca: formData.marca.trim(),
          modelo: formData.modelo.trim(),
          ano: formData.ano.trim(),
          preco: price,
          quilometragem: formData.quilometragem,
          cambio: formData.cambio,
          combustivel: formData.combustivel,
          tipo: formData.tipo,
          imagem_url: finalImageUrl,
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
      setImageFiles([]);
      
      // Refresh list
      fetchVehicles();
    } catch (err: any) {
      setErrorMessage(err.message === 'Preço inválido.' ? err.message : 'Erro ao adicionar veículo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja remover este veículo permanentemente?')) {
      return;
    }
    
    try {
      const { error } = await supabase.from('veiculos').delete().eq('id', id);
      if (error) throw error;
      
      // Remove from state
      setVehicles(vehicles.filter(v => v.id !== id));
      setSuccessMessage('Veículo removido com sucesso.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setErrorMessage('Erro ao remover veículo. Tente novamente.');
    }
  };

  if (!session) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4">
        <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-2xl max-w-md w-full">
          <h2 className="text-3xl font-display font-black text-center mb-6 dark:text-white uppercase italic">Acesso Restrito</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white"
                placeholder="Seu e-mail"
                autoComplete="off"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white"
                placeholder="Sua senha"
                required
              />
            </div>
            {authError && <p className="text-red-500 text-sm text-center font-bold">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-primary text-black font-black py-4 rounded-xl uppercase tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {authLoading ? 'Acessando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background-light dark:bg-background-dark px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
              Administração
            </h1>
            <p className="text-slate-500 font-medium mt-2">Logado como: {session.user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[10px] text-slate-400 hover:text-red-500 uppercase font-black tracking-widest transition-colors flex items-center gap-2"
          >
            <span className="material-icons-round text-sm">logout</span> Sair
          </button>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Vehicle Form */}
          <div className="lg:col-span-2 bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-xl">
            <h2 className="text-2xl font-black mb-8 dark:text-white uppercase italic">Adicionar Veículo</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Marca</label>
                  <input type="text" name="marca" value={formData.marca} onChange={handleInputChange} className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Modelo</label>
                  <input type="text" name="modelo" value={formData.modelo} onChange={handleInputChange} className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Ano</label>
                  <input type="text" name="ano" value={formData.ano} onChange={handleInputChange} className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Preço (R$)</label>
                  <input type="number" name="preco" value={formData.preco} onChange={handleInputChange} className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Quilometragem</label>
                  <input type="text" name="quilometragem" value={formData.quilometragem} onChange={handleInputChange} className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Câmbio</label>
                  <select name="cambio" value={formData.cambio} onChange={handleInputChange} className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white appearance-none">
                    <option value="Automático">Automático</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Combustível</label>
                  <select name="combustivel" value={formData.combustivel} onChange={handleInputChange} className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white appearance-none">
                    <option value="Gasolina">Gasolina</option>
                    <option value="Flex">Flex</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Elétrico">Elétrico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Tipo</label>
                  <select name="tipo" value={formData.tipo} onChange={handleInputChange} className="w-full bg-slate-100 dark:bg-background-dark border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white appearance-none">
                    <option value="Carro">Carro</option>
                    <option value="Moto">Moto</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-background-dark p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4">
                <h3 className="text-sm font-bold dark:text-white flex items-center gap-2">
                  <span className="material-icons-round text-primary">add_photo_alternate</span> Imagens do Veículo
                </h3>
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Fazer Upload de Imagens</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                  />
                  {imageFiles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {imageFiles.map((file, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                          <span className="material-icons-round text-xs">image</span>
                          {file.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-slate-400 mt-2">Selecione uma ou mais imagens. Cada uma será enviada e a URL gerada automaticamente.</p>
                </div>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
                  <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-400 uppercase">OU</span>
                  <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Inserir URLs (Uma por linha)</label>
                  <textarea
                    name="imagem_url"
                    value={formData.imagem_url}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary text-sm p-4 transition-all outline-none text-slate-900 dark:text-white custom-scrollbar resize-none"
                    placeholder="Deixe vazio se fizer upload acima..."
                  ></textarea>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={loading} className="w-full bg-primary text-black font-black py-4 px-10 rounded-xl uppercase tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-50 flex justify-center items-center gap-2">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> Salvando...</>
                  ) : (
                    <><span className="material-icons-round text-sm">add_circle</span> Adicionar Veículo</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Manage Vehicles List */}
          <div className="lg:col-span-1 bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-xl flex flex-col max-h-[800px]">
            <h2 className="text-xl font-black mb-6 dark:text-white uppercase italic flex justify-between items-center">
              Estoque Atual
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs">{vehicles.length}</span>
            </h2>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
              {loadingVehicles ? (
                <div className="text-center py-10 text-slate-500">Carregando...</div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">Nenhum veículo no estoque.</div>
              ) : (
                vehicles.map((v) => (
                  <div key={v.id} className="bg-slate-50 dark:bg-background-dark p-4 rounded-2xl border border-slate-200 dark:border-white/5 flex items-center justify-between group">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-[10px] font-black text-primary uppercase truncate">{v.marca}</p>
                      <p className="text-sm font-bold dark:text-white truncate">{v.modelo}</p>
                      <p className="text-xs text-slate-500">{v.ano}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(v.id)}
                      title="Remover veículo"
                      className="w-10 h-10 flex-shrink-0 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                    >
                      <span className="material-icons-round text-lg">delete_outline</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Admin;
