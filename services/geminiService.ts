import { GoogleGenAI, Type } from "@google/genai";
import type { ChatMessage, ImovelScore, Property } from '../types';

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
    const prompt = "Quais são os pontos de interesse importantes (supermercados, escolas, hospitais, parques) perto da latitude " + latitude + " e longitude " + longitude + "? Liste os 5 mais relevantes com seus nomes e tipo";
    try {
        const response = await model.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{googleMaps: {}}],
            },
        });
        return response.text;
    } catch(e) {
        console.error("Error with Google Maps grounding:", e);
        return "Não foi possível buscar pontos de interesse no momento.";
    }
};

export const generatePropertyDescription = async (property: Partial<Property>): Promise<string> => {
    const model = getGeminiAI().models;
    const prompt = `
        Gere uma descrição de marketing atraente e profissional para um imóvel com as seguintes características.
        Seja criativo e destaque os pontos positivos. A descrição deve ter no máximo 3 frases.

        - Tipo de Imóvel: ${property.type}
        - Título: ${property.title}
        - Quartos: ${property.bedrooms}
        - Banheiros: ${property.bathrooms}
        - Vagas na Garagem: ${property.vagas}
        - Área: ${property.area_m2} m²
        - Bairro: ${property.neighborhood}
        - Cidade: ${property.city}
        - Preço: R$ ${property.price} (${property.finalidade})

        Foque em adjetivos que evoquem conforto, modernidade, e uma boa oportunidade de negócio.
    `;

    try {
        const response = await model.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating property description:", error);
        return "Não foi possível gerar a descrição. Tente novamente.";
    }
};

export const generatePropertyScore = async (property: Partial<Property>): Promise<ImovelScore | null> => {
    const model = getGeminiAI().models;
    const prompt = `
        Analise o seguinte imóvel e gere um "Imóvel Score" em formato JSON.
        O score deve conter notas de 0 a 100 para 'location', 'costBenefit', e 'appreciation'.
        Inclua também uma 'analysis' de uma frase resumindo os pontos fortes.

        Dados do Imóvel:
        - Tipo: ${property.type}
        - Bairro: ${property.neighborhood}
        - Cidade: ${property.city}
        - Preço: R$ ${property.price} (${property.finalidade})
        - Área: ${property.area_m2} m²
        - Quartos: ${property.bedrooms}
        - Banheiros: ${property.bathrooms}
    `;

    try {
        const response = await model.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        location: { type: Type.NUMBER, description: "Nota de 0 a 100 para a localização." },
                        costBenefit: { type: Type.NUMBER, description: "Nota de 0 a 100 para o custo-benefício." },
                        appreciation: { type: Type.NUMBER, description: "Nota de 0 a 100 para o potencial de valorização." },
                        analysis: { type: Type.STRING, description: "Análise curta de uma frase." },
                    },
                    required: ["location", "costBenefit", "appreciation", "analysis"]
                },
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ImovelScore;
    } catch (error) {
        console.error("Error generating property score:", error);
        return null;
    }
};
