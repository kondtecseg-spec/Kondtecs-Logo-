
import React, { useState, useEffect, useRef } from 'react';
import { LogoStyle, LogoGenerationParams, GeneratedLogo, User, BusinessCardData } from './types';
import { generateLogoImage } from './services/geminiService';
import { LogoCard } from './components/LogoCard';
import { Logo, BrandName } from './components/Logo';
import { BusinessCardDesigner } from './components/BusinessCardDesigner';

const STYLES = Object.values(LogoStyle);

const STYLE_ICONS: Record<LogoStyle, React.ReactNode> = {
  [LogoStyle.MINIMALIST]: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM176,128a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,128Z"></path></svg>
  ),
  [LogoStyle.THREE_D]: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M224,103.41v49.18a16,16,0,0,1-8,13.86l-80,46.19a16,16,0,0,1-16,0l-80-46.19a16,16,0,0,1-8-13.86V103.41a16,16,0,0,1,8-13.86l80-46.19a16,16,0,0,1,16,0l80,46.19A16,16,0,0,1,224,103.41Z"></path></svg>
  ),
  [LogoStyle.VINTAGE]: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M192,48V32a16,16,0,0,0-16-16H80A16,16,0,0,0,64,32V48H32a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64a16,16,0,0,0-16-16ZM80,32h96V48H80ZM224,208H32V64H64V80a8,8,0,0,0,16,0V64h96V80a8,8,0,0,0,16,0V64h32Z"></path></svg>
  ),
  [LogoStyle.MODERN_TECH]: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M208,40H176V32a8,8,0,0,0-16,0v8H96V32A8,8,0,0,0,80,32v8H48A24,24,0,0,0,24,64V208a24,24,0,0,0,48,0H184a24,24,0,0,0,48,0V64A24,24,0,0,0,208,40ZM40,208a8,8,0,1,1,8,8A8,8,0,0,1,40,208Zm176,8a8,8,0,1,1,8-8A8,8,0,0,1,216,216ZM216,184H40V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Z"></path></svg>
  ),
  [LogoStyle.GRADIENT]: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M176,128a48,48,0,1,1-48-48A48,48,0,0,1,176,128Zm64,0a112,112,0,1,1-112-112A112.13,112.13,0,0,1,240,128Zm-16,0a96,96,0,1,0-96,96A96.11,96.11,0,0,0,224,128Z"></path></svg>
  ),
  [LogoStyle.HAND_DRAWN]: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path></svg>
  ),
  [LogoStyle.LUXURY]: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M245.54,92.56l-32-48a8,8,0,0,0-6.66-3.56H49.12a8,8,0,0,0-6.66,3.56l-32,48a8,8,0,0,0,.68,9.88l112,128a8,8,0,0,0,12,0l112-128A8,8,0,0,0,245.54,92.56ZM53.44,57h149.12l21.33,32H181.33L153.33,57ZM128,210.56,66.44,140.52,101.44,105h53.12l35,35.52ZM128,57h16l28,32H84ZM32.11,89,53.44,57l25.33,32H32.11Zm7.33,16H85.45l22,22.33L48.56,183ZM207.44,183,148.55,115.33l22-22.33h46.12Z"></path></svg>
  ),
  [LogoStyle.ABSTRACT]: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Z"></path></svg>
  ),
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [params, setParams] = useState<LogoGenerationParams>({
    prompt: '',
    style: LogoStyle.MINIMALIST,
    companyName: '',
    isHighQuality: false,
    aspectRatio: '1:1',
    editingImage: undefined
  });
  
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<GeneratedLogo[]>([]);
  const [savedCards, setSavedCards] = useState<BusinessCardData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loginInput, setLoginInput] = useState({ name: '', email: '' });
  const [selectedLogoForCard, setSelectedLogoForCard] = useState<GeneratedLogo | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('kondtec_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      loadProjects(parsedUser.id);
      loadCards(parsedUser.id);
    }
  }, []);

  const loadProjects = (userId: string) => {
    const saved = localStorage.getItem(`kondtec_projects_${userId}`);
    if (saved) setProjects(JSON.parse(saved));
  };

  const loadCards = (userId: string) => {
    const saved = localStorage.getItem(`kondtec_cards_${userId}`);
    if (saved) setSavedCards(JSON.parse(saved));
  };

  const saveProjects = (userId: string, newProjects: GeneratedLogo[]) => {
    localStorage.setItem(`kondtec_projects_${userId}`, JSON.stringify(newProjects));
    setProjects(newProjects);
  };

  const syncCards = (userId: string, newCards: BusinessCardData[]) => {
    localStorage.setItem(`kondtec_cards_${userId}`, JSON.stringify(newCards));
    setSavedCards(newCards);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.name.trim() || !loginInput.email.trim()) return;
    const newUser: User = { id: btoa(loginInput.email).substring(0, 12), name: loginInput.name, email: loginInput.email };
    localStorage.setItem('kondtec_user', JSON.stringify(newUser));
    setUser(newUser);
    loadProjects(newUser.id);
    loadCards(newUser.id);
  };

  const handleLogout = () => {
    if (confirm("Deseja sair da sua conta?")) {
      localStorage.removeItem('kondtec_user');
      setUser(null);
      setProjects([]);
      setSavedCards([]);
    }
  };

  const handleGenerate = async () => {
    if (!params.prompt.trim()) {
      setError("Por favor, descreva o que você imagina para o logotipo.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const imageUrl = await generateLogoImage(params);
      const newLogo: GeneratedLogo = { id: Date.now().toString(), url: imageUrl, prompt: params.prompt, style: params.style, companyName: params.companyName, timestamp: Date.now() };
      if (user) {
        const updated = [newLogo, ...projects];
        saveProjects(user.id, updated);
      } else {
        setProjects(prev => [newLogo, ...prev]);
      }
      setParams(prev => ({ ...prev, editingImage: undefined }));
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err: any) {
      if (err.message === 'API_KEY_ISSUE') {
         setError("Para usar a Qualidade Pro, você precisa selecionar sua chave de API.");
         // @ts-ignore
         window.aistudio?.openSelectKey();
      } else {
        setError("Ocorreu um erro ao gerar. Tente uma descrição mais detalhada.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (url: string, id: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `kondtec-design-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditLogo = (logo: GeneratedLogo) => {
    setParams({
      prompt: logo.prompt,
      style: logo.style,
      companyName: logo.companyName || '',
      isHighQuality: false,
      aspectRatio: '1:1',
      editingImage: logo.url
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProject = (id: string) => {
    if (!user) return;
    if (confirm("Tem certeza que deseja apagar este projeto permanentemente?")) {
      const updated = projects.filter(p => p.id !== id);
      saveProjects(user.id, updated);
    }
  };

  const deleteCard = (id: string) => {
    if (!user) return;
    if (confirm("Deseja apagar este design de cartão?")) {
      const filtered = savedCards.filter(c => c.id !== id);
      syncCards(user.id, filtered);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl text-center">
          <div className="mx-auto mb-8 animate-float">
             <Logo className="w-32 h-24 mx-auto" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-[#003366]">Kondtec Logo</h1>
            <p className="text-slate-500 text-sm">Sua marca, reinventada por IA.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome</label>
              <input required type="text" value={loginInput.name} onChange={e => setLoginInput(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003366]/30 transition-all shadow-sm" placeholder="Como deseja ser chamado?" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
              <input required type="email" value={loginInput.email} onChange={e => setLoginInput(prev => ({ ...prev, email: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003366]/30 transition-all shadow-sm" placeholder="seu@email.com" />
            </div>
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#003366] to-[#006699] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-95 active:scale-95 transition-all shadow-xl shadow-[#003366]/20">Acessar Estúdio</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-20 h-14" />
            <BrandName />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end leading-none">
              <span className="text-xs font-bold text-[#003366] mb-1">{user.name}</span>
              <span className="text-[10px] text-slate-400">{user.email}</span>
            </div>
            <button onClick={handleLogout} className="p-2.5 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L196.69,120H104a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z"></path></svg>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <header className="space-y-2">
              <h1 className="text-4xl font-black text-[#003366]">Criar <span className="text-[#ff4e00]">Identidade</span></h1>
              <p className="text-slate-500 font-medium">Sua marca reinventada por nossa inteligência artificial.</p>
            </header>
            <div className="space-y-6 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-2xl relative overflow-hidden">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome da Marca</label>
                  <input type="text" value={params.companyName} onChange={(e) => setParams(prev => ({ ...prev, companyName: e.target.value }))} placeholder="ex: Kondtec Solutions" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#003366]/20 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">O que você imagina?</label>
                  <textarea rows={4} value={params.prompt} onChange={(e) => setParams(prev => ({ ...prev, prompt: e.target.value }))} placeholder="Ex: Logo de tecnologia azul e laranja, futurista..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#003366]/20 outline-none resize-none" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">Estilo de Design</label>
                  <div className="grid grid-cols-2 gap-3">
                    {STYLES.map((style) => (
                      <button key={style} onClick={() => setParams(prev => ({ ...prev, style }))} className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border ${params.style === style ? 'bg-gradient-to-br from-[#003366] to-[#006699] border-blue-400 text-white shadow-xl scale-[1.02]' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'}`}>
                        <div className={`p-2 rounded-xl ${params.style === style ? 'bg-white/20' : 'bg-slate-100'}`}>{STYLE_ICONS[style]}</div>
                        <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-tight">{style}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#003366]">Modo Alta Fidelidade</span>
                    <span className="text-[9px] text-slate-400 uppercase font-bold mt-0.5">Usa Gemini 3 Pro</span>
                  </div>
                  <button onClick={() => setParams(prev => ({ ...prev, isHighQuality: !prev.isHighQuality }))} className={`w-12 h-6 rounded-full transition-all relative ${params.isHighQuality ? 'bg-[#ff4e00]' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${params.isHighQuality ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
              {error && <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-[11px]">{error}</div>}
              <button onClick={handleGenerate} disabled={loading} className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest bg-gradient-to-r from-[#003366] to-[#ff4e00] text-white hover:opacity-90 active:scale-95 transition-all">
                {loading ? 'Gerando...' : 'Gerar Logotipo'}
              </button>
            </div>
          </div>

          <div ref={resultRef} className="lg:col-span-7 space-y-12">
            <div className="bg-white p-2 rounded-[2.5rem] aspect-square flex items-center justify-center border border-slate-200 relative overflow-hidden shadow-2xl group">
              {loading ? (
                <div className="text-center animate-pulse">
                  <div className="w-24 h-24 border-4 border-[#003366] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-[#003366] font-black uppercase text-sm tracking-widest">Processando sua marca...</p>
                </div>
              ) : projects.length > 0 ? (
                <div className="w-full h-full relative flex items-center justify-center">
                  <img src={projects[0].url} className="max-w-[90%] max-h-[90%] object-contain rounded-3xl" alt="Preview" />
                  <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setSelectedLogoForCard(projects[0])} className="p-4 bg-white/90 backdrop-blur text-[#003366] rounded-2xl shadow-xl hover:bg-[#ff4e00] hover:text-white transition-all">Criar Cartão</button>
                    <button onClick={() => downloadImage(projects[0].url, projects[0].id)} className="p-4 bg-[#ff4e00] text-white rounded-2xl shadow-xl transition-all">Baixar</button>
                  </div>
                </div>
              ) : (
                <div className="text-center opacity-20"><Logo className="w-32 h-20 mx-auto" /></div>
              )}
            </div>

            <div className="space-y-8">
              <h3 className="text-2xl font-black text-[#003366] border-b pb-4">Histórico de Logotipos</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {projects.map(logo => (
                  <LogoCard 
                    key={logo.id} 
                    logo={logo} 
                    onDownload={downloadImage} 
                    onEdit={handleEditLogo} 
                    onDelete={deleteProject} 
                    onCreateCard={setSelectedLogoForCard} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Saved Cards Section */}
        {savedCards.length > 0 && (
          <div className="space-y-8">
             <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-2xl font-black text-[#003366]">Cartões de Visita Salvos</h3>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{savedCards.length} Projetos</span>
             </div>
             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedCards.map(card => (
                  <div key={card.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-all group">
                     <div className={`aspect-[1.75/1] rounded-xl mb-4 overflow-hidden border border-slate-100 ${card.isDark ? 'bg-slate-900' : 'bg-slate-50'} flex items-center justify-center relative`}>
                        <img src={card.logoUrl} className="w-16 h-16 object-contain z-10" alt="Logo" />
                        <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(45deg, ${card.primaryColor}, ${card.accentColor})` }} />
                     </div>
                     <div className="flex justify-between items-end">
                        <div className="min-w-0">
                           <h4 className="font-black text-[#003366] truncate">{card.name}</h4>
                           <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{card.role}</p>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => deleteCard(card.id!)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                           </button>
                           <button onClick={() => {
                             const l = projects.find(p => p.id === card.logoId) || { id: card.logoId, url: card.logoUrl, companyName: card.companyName } as GeneratedLogo;
                             setSelectedLogoForCard(l);
                           }} className="p-2 bg-[#003366]/5 text-[#003366] rounded-lg hover:bg-[#003366] hover:text-white transition-all">Editar</button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </main>

      {selectedLogoForCard && (
        <BusinessCardDesigner logo={selectedLogoForCard} onClose={() => {
          setSelectedLogoForCard(null);
          if (user) loadCards(user.id);
        }} />
      )}

      <footer className="border-t py-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
        © 2025 Kondtec Logo - Estúdio Criativo IA
      </footer>
    </div>
  );
};

export default App;
