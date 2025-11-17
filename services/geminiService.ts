
import { GoogleGenAI } from "@google/genai";
import type { ChatMessage, Property } from '../types';

let ai: GoogleGenAI | null = null;

export const initGemini = (apiKey: string) => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }
};

export const getGeminiAI = (): GoogleGenAI => {
    if (!ai) {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("Gemini not initialized and no API key found in environment.");
      }
      initGemini(apiKey);
    }
    return ai!;
};

// Feature: Fast AI responses & AI powered chatbot
export const continueChat = async (history: ChatMessage[], newMessage: string, properties: Property[]): Promise<string> => {
  const model = getGeminiAI().models;
  const propertyContext = properties.map(p => 
    `ID: ${p.id}, Título: ${p.title}, Tipo: ${p.type}, Preço: R$ ${p.price}, Quartos: ${p.bedrooms}, Bairro: ${p.neighborhood}, Cidade: ${p.city}`
  ).join('\n');
  
  const prompt = `
    Você é 'Personal Imóvel', um assistente de IA para uma imobiliária. Sua personalidade é prestativa, inteligente e amigável.
    Seu objetivo é ajudar os usuários a encontrar o imóvel perfeito com base em suas necessidades.
    
    Aqui está o catálogo de imóveis disponíveis:
    ${propertyContext}

    Aqui está o histórico da nossa conversa:
    ${history.map(m => `${m.sender}: ${m.text}`).join('\n')}

    A nova mensagem do usuário é: "${newMessage}"

    Responda à mensagem do usuário de forma concisa e útil. Se o usuário estiver perguntando sobre imóveis, use o catálogo para responder. Se ele der um ID, fale sobre aquele imóvel específico. Se ele descrever o que quer, sugira imóveis do catálogo que correspondam. Não invente imóveis.
  `;

  try {
    const response = await model.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error in Gemini chat:", error);
    return "Desculpe, estou com um problema para me conectar. Tente novamente mais tarde.";
  }
};

// Feature: Use Google Maps data
export const findNearbyPointsOfInterest = async (latitude: number, longitude: number): Promise<string> => {
    const model = getGeminiAI().models;
    const prompt = "Quais são os pontos de interesse importantes (supermercados, escolas, hospitais, parques) perto da latitude " + latitude + " e longitude " + longitude + "? Liste os 5 mais relevantes com seus nomes e tipo.";

    try {
        const response = await model.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{googleMaps: {}}],
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error with Maps Grounding:", error);
        return "Não foi possível buscar pontos de interesse próximos.";
    }
};

// Feature: Analyze images
export const analyzeImageWithGemini = async (base64Image: string, mimeType: string): Promise<string> => {
    const model = getGeminiAI().models;
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    };
    const textPart = {
      text: "Você é um especialista em design de interiores. Analise esta imagem de um imóvel e descreva o estilo de decoração, os pontos fortes e sugira uma pequena melhoria."
    };

    try {
        const response = await model.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing image:", error);
        return "Não foi possível analisar a imagem.";
    }
};

// Feature: Generate images with a prompt
export const generateStagingImage = async (prompt: string): Promise<string> => {
    const model = getGeminiAI().models;
    try {
        const response = await model.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `Uma foto de alta qualidade de um interior de imóvel com o seguinte estilo: ${prompt}. Foco em realismo e design moderno.`,
            config: {
                numberOfImages: 1,
                aspectRatio: '16:9',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        return "";
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Não foi possível gerar a imagem.");
    }
};
