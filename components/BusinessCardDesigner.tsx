
import React, { useState } from 'react';
import { GeneratedLogo, BusinessCardData, CardLayout, BackStyle } from '../types';

interface Props {
  logo: GeneratedLogo;
  onClose: () => void;
}

const PALETTE_PRESETS = [
  { name: 'Kondtec', primary: '#003366', accent: '#ff4e00' },
  { name: 'Noir', primary: '#1a1a1a', accent: '#ffffff' },
  { name: 'Ocean', primary: '#004a7c', accent: '#00d4ff' },
  { name: 'Forest', primary: '#1b4332', accent: '#95d5b2' },
  { name: 'Luxury', primary: '#1c1c1c', accent: '#d4af37' },
  { name: 'Vibrant', primary: '#7209b7', accent: '#f72585' },
];

export const BusinessCardDesigner: React.FC<Props> = ({ logo, onClose }) => {
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [data, setData] = useState<BusinessCardData>({
    logoId: logo.id,
    logoUrl: logo.url,
    companyName: logo.companyName || 'Sua Empresa',
    slogan: 'Inovação e Qualidade',
    name: 'Seu Nome Aqui',
    role: 'Cargo / Profissão',
    phone: '+55 (11) 99999-9999',
    email: 'contato@suaempresa.com',
    website: 'www.suaempresa.com.br',
    address: 'Sua Rua, 123 - Cidade, Estado',
    layout: 'modern',
    backStyle: 'logo-centered',
    isDark: true,
    backIsDark: false,
    primaryColor: '#003366',
    accentColor: '#ff4e00'
  });

  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  const saveToHistory = () => {
    const savedUser = localStorage.getItem('kondtec_user');
    if (!savedUser) return;
    
    setSaving(true);
    const user = JSON.parse(savedUser);
    const cardId = Date.now().toString();
    const newCard = { ...data, id: cardId };

    const existingCardsRaw = localStorage.getItem(`kondtec_cards_${user.id}`);
    const existingCards = existingCardsRaw ? JSON.parse(existingCardsRaw) : [];
    
    localStorage.setItem(`kondtec_cards_${user.id}`, JSON.stringify([newCard, ...existingCards]));
    
    setTimeout(() => {
      setSaving(false);
      alert("Design frente e verso salvo no seu estúdio!");
      onClose();
    }, 800);
  };

  const renderToCanvas = async (side: 'front' | 'back'): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    canvas.width = 1050;
    canvas.height = 600;

    const isDark = side === 'front' ? data.isDark : data.backIsDark;
    ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorativos
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = data.accentColor;
    ctx.beginPath(); ctx.arc(canvas.width, 0, 300, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = data.primaryColor;
    ctx.beginPath(); ctx.arc(0, canvas.height, 200, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1.0;

    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.src = logo.url;
    await new Promise((resolve) => { logoImg.onload = resolve; });

    ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';

    if (side === 'front') {
      ctx.drawImage(logoImg, 750, 150, 200, 200);
      ctx.font = 'bold 48px Inter, sans-serif';
      ctx.fillText(data.name, 80, 200);
      ctx.fillStyle = data.accentColor;
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillText(data.role.toUpperCase(), 80, 250);
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,42,0.7)';
      ctx.font = '20px Inter, sans-serif';
      ctx.fillText(data.phone, 110, 340);
      ctx.fillText(data.email, 110, 380);
      ctx.fillText(data.website, 110, 420);
    } else {
      if (data.backStyle === 'logo-centered') {
        ctx.drawImage(logoImg, canvas.width/2 - 125, canvas.height/2 - 180, 250, 250);
        ctx.textAlign = 'center';
        ctx.font = 'bold 36px Inter, sans-serif';
        ctx.fillText(data.companyName?.toUpperCase() || '', canvas.width/2, 480);
        ctx.font = '24px Inter, sans-serif';
        ctx.fillStyle = data.accentColor;
        ctx.fillText(data.slogan || '', canvas.width/2, 520);
      } else if (data.backStyle === 'full-color') {
        ctx.fillStyle = data.primaryColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(logoImg, canvas.width/2 - 150, canvas.height/2 - 150, 300, 300);
      } else {
        ctx.drawImage(logoImg, 80, 80, 120, 120);
        ctx.font = 'bold 72px Inter, sans-serif';
        ctx.fillText(data.companyName?.toUpperCase() || '', 80, 320);
        ctx.font = '32px Inter, sans-serif';
        ctx.fillStyle = data.accentColor;
        ctx.fillText(data.slogan || '', 80, 370);
      }
    }

    return canvas.toDataURL('image/png');
  };

  const handleDownloadKit = async () => {
    setExporting(true);
    try {
      const frontData = await renderToCanvas('front');
      const backData = await renderToCanvas('back');

      const download = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
      };

      download(frontData, `cartao-${data.name.toLowerCase()}-frente.png`);
      setTimeout(() => download(backData, `cartao-${data.name.toLowerCase()}-verso.png`), 500);

    } catch (err) {
      alert("Erro ao exportar arquivos.");
    } finally {
      setExporting(false);
    }
  };

  const CardPreview = () => {
    const isDark = activeSide === 'front' ? data.isDark : data.backIsDark;
    const themeClass = isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900';
    const borderClass = isDark ? 'border-slate-800' : 'border-slate-100';

    return (
      <div className={`relative w-full aspect-[1.75/1] rounded-xl overflow-hidden shadow-2xl transition-all duration-500 border-4 ${borderClass} ${themeClass} flex p-8`}>
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: data.accentColor }} />
        <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full opacity-5" style={{ backgroundColor: data.primaryColor }} />
        
        {activeSide === 'front' ? (
          <div className="flex w-full items-center justify-between z-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4 max-w-[60%] text-left">
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight leading-tight">{data.name}</h3>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: data.accentColor }}>{data.role}</p>
              </div>
              <div className="space-y-1.5 opacity-80">
                <p className="text-[10px] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: data.primaryColor }}/> {data.phone}
                </p>
                <p className="text-[10px] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: data.primaryColor }}/> {data.email}
                </p>
                <p className="text-[10px] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: data.primaryColor }}/> {data.website}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <img src={logo.url} className="w-24 h-24 object-contain rounded-lg shadow-lg" alt="Logo" />
              <p className="text-[9px] font-black uppercase tracking-tighter opacity-40">{data.companyName}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full h-full items-center justify-center space-y-4 z-10 animate-in fade-in slide-in-from-left-4 duration-500">
             {data.backStyle === 'logo-centered' && (
               <>
                 <img src={logo.url} className="w-32 h-32 object-contain rounded-xl shadow-2xl" alt="Logo" />
                 <div className="text-center">
                   <p className="text-xs font-black uppercase tracking-[0.3em]">{data.companyName}</p>
                   <p className="text-[9px] font-bold uppercase mt-1 opacity-60" style={{ color: data.accentColor }}>{data.slogan}</p>
                 </div>
               </>
             )}
             {data.backStyle === 'full-color' && (
               <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: data.primaryColor }}>
                 <img src={logo.url} className="w-44 h-44 object-contain drop-shadow-2xl" alt="Logo" />
               </div>
             )}
             {data.backStyle === 'minimal-brand' && (
                <div className="w-full h-full flex flex-col justify-between p-4">
                  <img src={logo.url} className="w-16 h-16 object-contain self-start" alt="Logo" />
                  <div className="text-left">
                    <h3 className="text-4xl font-black leading-none tracking-tighter" style={{ color: data.primaryColor }}>{data.companyName}</h3>
                    <p className="text-sm font-bold opacity-60 mt-1 uppercase tracking-widest">{data.slogan}</p>
                  </div>
                </div>
             )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-300">
      <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-full lg:h-auto max-h-[95vh]">
        
        <div className="lg:w-1/3 bg-slate-50 p-8 md:p-10 overflow-y-auto custom-scrollbar border-r border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg></button>
            <h2 className="text-xl font-black text-[#003366]">Designer de Cartão</h2>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuração da {activeSide === 'front' ? 'Frente' : 'Verso'}</label>
              
              <div className="flex gap-2 p-1 bg-slate-200 rounded-2xl">
                <button onClick={() => setActiveSide('front')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeSide === 'front' ? 'bg-white text-[#003366] shadow-sm' : 'text-slate-500'}`}>Frente</button>
                <button onClick={() => setActiveSide('back')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeSide === 'back' ? 'bg-white text-[#003366] shadow-sm' : 'text-slate-500'}`}>Verso</button>
              </div>

              {activeSide === 'front' ? (
                <div className="space-y-4 pt-4 animate-in fade-in duration-300">
                  <div className="flex gap-2">
                    <button onClick={() => setData(prev => ({ ...prev, isDark: false }))} className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${!data.isDark ? 'bg-white border-[#003366]' : 'bg-slate-100 border-transparent text-slate-400'}`}>Claro</button>
                    <button onClick={() => setData(prev => ({ ...prev, isDark: true }))} className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${data.isDark ? 'bg-slate-900 text-white border-slate-700' : 'bg-slate-100 border-transparent text-slate-400'}`}>Escuro</button>
                  </div>
                  <input value={data.name} onChange={e => setData(p => ({...p, name: e.target.value}))} className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs outline-none shadow-sm" placeholder="Nome Completo" />
                  <input value={data.role} onChange={e => setData(p => ({...p, role: e.target.value}))} className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs outline-none shadow-sm" placeholder="Cargo" />
                  <input value={data.phone} onChange={e => setData(p => ({...p, phone: e.target.value}))} className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs outline-none shadow-sm" placeholder="Telefone" />
                </div>
              ) : (
                <div className="space-y-4 pt-4 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 gap-2">
                    {(['logo-centered', 'minimal-brand', 'full-color'] as BackStyle[]).map(s => (
                      <button key={s} onClick={() => setData(prev => ({ ...prev, backStyle: s }))} className={`py-3 px-4 rounded-xl text-[10px] font-bold uppercase border transition-all ${data.backStyle === s ? 'bg-[#003366] text-white border-[#003366]' : 'bg-white border-slate-200 text-slate-400'}`}>{s.replace('-', ' ')}</button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setData(prev => ({ ...prev, backIsDark: false }))} className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${!data.backIsDark ? 'bg-white border-[#003366]' : 'bg-slate-100 border-transparent text-slate-400'}`}>Fundo Claro</button>
                    <button onClick={() => setData(prev => ({ ...prev, backIsDark: true }))} className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${data.backIsDark ? 'bg-slate-900 text-white border-slate-700' : 'bg-slate-100 border-transparent text-slate-400'}`}>Fundo Escuro</button>
                  </div>
                  <input value={data.slogan} onChange={e => setData(p => ({...p, slogan: e.target.value}))} className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs outline-none shadow-sm" placeholder="Slogan ou Missão" />
                </div>
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-200">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cores Globais</label>
              <div className="grid grid-cols-6 gap-2">
                {PALETTE_PRESETS.map(p => (
                  <button key={p.name} onClick={() => setData(prev => ({ ...prev, primaryColor: p.primary, accentColor: p.accent }))} className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex overflow-hidden ring-1 ring-slate-200 hover:scale-110 transition-transform">
                    <div className="w-1/2 h-full" style={{ backgroundColor: p.primary }} /><div className="w-1/2 h-full" style={{ backgroundColor: p.accent }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-2/3 bg-[#003366] p-8 md:p-16 flex flex-col items-center justify-center relative overflow-hidden">
           <div className="w-full max-w-2xl space-y-12 relative z-10 text-center">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-blue-300 uppercase tracking-[0.5em]">{activeSide === 'front' ? 'Lado A: Informações' : 'Lado B: Branding'}</span>
                <h3 className="text-white text-3xl font-black italic">Preview do Cartão</h3>
              </div>
              <div className="perspective-1000 transform transition-transform duration-700">
                <CardPreview />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full px-4">
                <button onClick={handleDownloadKit} disabled={exporting} className="flex-1 px-6 py-5 bg-white text-[#003366] rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                  {exporting ? <div className="w-4 h-4 border-2 border-[#003366] border-t-transparent rounded-full animate-spin" /> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V40a8,8,0,0,0-16,0v84.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z"></path></svg>}
                  {exporting ? 'Preparando Kit...' : 'Baixar Kit (F+V)'}
                </button>
                <button onClick={saveToHistory} disabled={saving} className="flex-1 px-6 py-5 bg-[#ff4e00] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-100 transition-all">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A24,24,0,0,0,24,56V200a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V56A24,24,0,0,0,208,32ZM216,200a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V88H216Zm0-128H40V56a8,8,0,0,1,8-8H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24a8,8,0,0,1,8,8Z"></path></svg>}
                  {saving ? 'Salvando...' : 'Salvar no Estúdio'}
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
