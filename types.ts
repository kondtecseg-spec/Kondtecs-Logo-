
export enum LogoStyle {
  MINIMALIST = 'Minimalista e Plano',
  THREE_D = 'Renderização 3D e Profundidade',
  VINTAGE = 'Vintage e Retrô',
  MODERN_TECH = 'Tecnologia Moderna',
  GRADIENT = 'Gradiente Vibrante',
  HAND_DRAWN = 'Orgânico e Manual',
  LUXURY = 'Elegante e Luxo',
  ABSTRACT = 'Abstrato Geométrico'
}

export type CardLayout = 'classic' | 'modern' | 'minimal' | 'vertical';
export type BackStyle = 'logo-centered' | 'minimal-brand' | 'full-color';

export interface BusinessCardData {
  id?: string;
  logoId: string;
  logoUrl: string;
  companyName?: string;
  slogan?: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  layout: CardLayout;
  backStyle: BackStyle;
  isDark: boolean;
  backIsDark: boolean;
  primaryColor: string;
  accentColor: string;
}

export interface LogoGenerationParams {
  prompt: string;
  style: LogoStyle;
  companyName?: string;
  isHighQuality: boolean;
  aspectRatio: "1:1" | "4:3" | "16:9";
  editingImage?: string; 
}

export interface GeneratedLogo {
  id: string;
  url: string;
  prompt: string;
  style: LogoStyle;
  companyName?: string;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
