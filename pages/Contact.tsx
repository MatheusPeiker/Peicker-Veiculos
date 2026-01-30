import React, { useState } from 'react';

const Contact: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'' | 'sending' | 'success' | 'error'>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        // Mock success
        setTimeout(() => {
            setStatus('success');
            setName('');
            setEmail('');
            setPhone('');
            setMessage('');
            setTimeout(() => setStatus(''), 3000);
        }, 1500);
    };

    return (
        <div className="pt-32 pb-20 min-h-screen bg-white dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px] block mb-4">Fale Conosco</span>
                    <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
                        ENTRE EM <span className="text-primary">CONTATO.</span>
                    </h1>
                    <p className="mt-6 text-slate-500 max-w-2xl mx-auto font-light">
                        Estamos prontos para atender você. Tire suas dúvidas, agende uma visita ou conheça nosso estoque pessoalmente.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div className="space-y-12 animate-fade-in-up delay-100">
                        {/* Address */}
                        <div className="group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <span className="material-icons-round">location_on</span>
                                </div>
                                <h3 className="font-display font-black text-xl uppercase italic dark:text-white">Nossa Loja</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 pl-16 leading-relaxed">
                                Rua Chile 578<br />
                                Timbó - SC, Brasil<br />
                                CEP: 89120-000
                            </p>
                            <div className="mt-6 pl-16">
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=Rua+Chile+578,Timbo,SC"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 border-b-2 border-primary/20 pb-1"
                                >
                                    Ver no Google Maps
                                </a>
                            </div>
                        </div>

                        {/* Phone/WhatsApp */}
                        <div className="group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <span className="material-icons-round">whatsapp</span>
                                </div>
                                <h3 className="font-display font-black text-xl uppercase italic dark:text-white">WhatsApp & Telefone</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 pl-16 leading-relaxed mb-2">
                                Atendimento rápido e personalizado.
                            </p>
                            <a
                                href="https://wa.me/5547992212581"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block pl-16 text-2xl font-black text-slate-900 dark:text-white hover:text-primary transition-colors"
                            >
                                +55 (47) 99221-2581
                            </a>
                        </div>

                        {/* Social Media */}
                        <div className="group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <span className="material-icons-round">share</span>
                                </div>
                                <h3 className="font-display font-black text-xl uppercase italic dark:text-white">Redes Sociais</h3>
                            </div>
                            <div className="pl-16 flex gap-4">
                                <a
                                    href="https://www.instagram.com/f.p.veiculos/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-pink-500/20"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </a>
                                <a
                                    href="https://www.facebook.com/fellipepeickerveiculos"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-14 h-14 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-blue-500/20"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-slate-50 dark:bg-surface-dark p-8 md:p-12 rounded-[40px] border border-slate-200 dark:border-white/5 relative overflow-hidden animate-fade-in-up delay-200 shadow-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                            <span className="material-icons-round text-9xl text-slate-900 dark:text-white">mail_outline</span>
                        </div>

                        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                            <h3 className="font-display font-black text-2xl uppercase italic dark:text-white mb-8 border-b border-primary/20 pb-4 inline-block">Envie uma mensagem</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Seu Nome</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full bg-white dark:bg-white/5 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                                        placeholder="Nome completo"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Seu Telefone</label>
                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        className="w-full bg-white dark:bg-white/5 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Seu E-mail</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-white dark:bg-white/5 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                                    placeholder="exemplo@email.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Mensagem</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    className="w-full bg-white dark:bg-white/5 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none shadow-sm"
                                    placeholder="Como podemos ajudar?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending' || status === 'success'}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 ${status === 'success'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-primary text-black hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                            >
                                {status === 'sending' ? (
                                    <>Enviando... <span className="animate-spin material-icons-round text-sm">refresh</span></>
                                ) : status === 'success' ? (
                                    <>Mensagem Enviada! <span className="material-icons-round text-sm">check</span></>
                                ) : (
                                    <>Enviar Mensagem <span className="material-icons-round text-sm">send</span></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Map Embed */}
                <div className="mt-20 rounded-[40px] overflow-hidden border border-slate-200 dark:border-white/5 h-[400px] relative grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl animate-fade-in-up delay-300">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.088863678036!2d-49.27856412456489!3d-26.868777976673623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94defcdf33e66699%3A0xe644f881249d95f8!2sRua%20Chile%2C%20578%20-%20Timb%C3%B3%2C%20SC%2C%2089120-000!5e0!3m2!1spt-BR!2sbr!4v1716921234567!5m2!1spt-BR!2sbr"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Localização Peicker Veículos"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default Contact;
