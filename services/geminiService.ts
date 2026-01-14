
import { GoogleGenAI } from "@google/genai";
import { LogoGenerationParams, LogoStyle } from "../types";

export const generateLogoImage = async (params: LogoGenerationParams): Promise<string> => {
  // Fix: Initialize GoogleGenAI with process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const styleKeywords: Record<LogoStyle, string> = {
    [LogoStyle.MINIMALIST]: "flat design, minimalist, clean lines, simple shapes, vector style, white background",
    [LogoStyle.THREE_D]: "3D isometric, depth, realistic lighting, octane render, high detail, shadow effects",
    [LogoStyle.VINTAGE]: "retro aesthetic, textured, classic typography, muted colors, heritage feel, badge style",
    [LogoStyle.MODERN_TECH]: "futuristic, digital, neon accents, sharp geometry, high-tech, cyber style",
    [LogoStyle.GRADIENT]: "vibrant colors, mesh gradient, smooth transitions, modern, colorful",
    [LogoStyle.HAND_DRAWN]: "sketch style, charcoal, artistic, organic lines, handcrafted, unique texture",
    [LogoStyle.LUXURY]: "gold and black, premium, elegant, serif typography, sophisticated, high-end",
    [LogoStyle.ABSTRACT]: "non-representational, geometric, conceptual, avant-garde, structural"
  };

  const modelName = params.isHighQuality ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  const basePrompt = params.editingImage 
    ? `Edit this logo based on: ${params.prompt}. Keep the core brand identity of ${params.companyName || 'the brand'} but apply the style: ${styleKeywords[params.style]}.`
    : `Professional logo for ${params.companyName || 'a brand'}. Subject: ${params.prompt}. Style: ${styleKeywords[params.style]}. The logo should be centered, high resolution, professional quality, isolated on a clean background, suitable for branding.`;

  const contents: any = {
    parts: []
  };

  if (params.editingImage) {
    // Adiciona a imagem base se estiver em modo de edição
    contents.parts.push({
      inlineData: {
        data: params.editingImage.split(',')[1],
        mimeType: 'image/png'
      }
    });
  }
  
  contents.parts.push({ text: basePrompt });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        imageConfig: {
          aspectRatio: params.aspectRatio,
          imageSize: params.isHighQuality ? "1K" : undefined
        }
      }
    });

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("Nenhuma imagem foi gerada na resposta.");
  } catch (error: any) {
    console.error("Erro na geração de imagem Gemini:", error);
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_ISSUE");
    }
    throw error;
  }
};
