
import React from 'react';
import { GeneratedLogo } from '../types';

interface LogoCardProps {
  logo: GeneratedLogo;
  onDownload: (url: string, id: string) => void;
  onEdit: (logo: GeneratedLogo) => void;
  onDelete: (id: string) => void;
  onCreateCard: (logo: GeneratedLogo) => void;
}

export const LogoCard: React.FC<LogoCardProps> = ({ logo, onDownload, onEdit, onDelete, onCreateCard }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-slate-200 shadow-lg">
      <img 
        src={logo.url} 
        alt={logo.prompt} 
        className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/30 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 md:p-4">
        <div className="flex justify-between items-start mb-1.5 md:mb-2">
          <div className="min-w-0 flex-1">
            <p className="text-[8px] md:text-xs font-bold text-orange-400 uppercase tracking-tighter truncate">{logo.style}</p>
            <p className="text-white text-[9px] md:text-[10px] font-medium opacity-70 line-clamp-1">{logo.companyName || 'Sem nome'}</p>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(logo.id);
            }}
            className="p-1 md:p-1.5 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors ml-1 z-20"
            title="Excluir Projeto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 md:w-3.5 md:h-3.5" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
          </button>
        </div>
        
        <div className="flex flex-col gap-1.5 md:gap-2 mt-1 md:mt-2">
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(logo);
              }}
              className="py-2 bg-[#003366]/30 text-white rounded-lg font-bold text-[8px] md:text-[10px] hover:bg-[#003366] transition-all flex items-center justify-center gap-1 active:scale-95 border border-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" fill="currentColor" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path></svg>
              Editar
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDownload(logo.url, logo.id);
              }}
              className="py-2 bg-white/20 text-white rounded-lg font-bold text-[8px] md:text-[10px] hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-1 active:scale-95 border border-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" fill="currentColor" viewBox="0 0 256 256"><path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V40a8,8,0,0,0-16,0v84.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z"></path></svg>
              Baixar
            </button>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onCreateCard(logo);
            }}
            className="w-full py-2.5 bg-[#ff4e00] text-white rounded-lg font-black text-[9px] md:text-[11px] uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-orange-950/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM216,200H40V144H216Zm0-72H40V56H216Zm-32-40a8,8,0,1,1-8,8A8,8,0,0,1,184,88Zm-32,0a8,8,0,1,1-8,8A8,8,0,0,1,152,88Z"></path></svg>
            Criar Cartão de Visita
          </button>
        </div>
      </div>
    </div>
  );
};
