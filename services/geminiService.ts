
import { GoogleGenAI, Type } from "@google/genai";
import { SocialPostResult, Product, CampaignContent } from "../types";

// NOTE: For local development, ensure process.env.API_KEY is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates social media content (captions, hashtags, image prompt) from a text topic
 */
export const generateSocialContent = async (topic: string): Promise<SocialPostResult> => {
  const prompt = `
    Role: Social Media Expert.
    Topic: "${topic}"
    
    Task: 
    1. Generate 3 distinct caption options with different tones (e.g., Witty, Professional, Minimalist).
    2. Generate 15 high-ranking hashtags relevant to the topic.
    3. Write a highly detailed, artistic image generation prompt that would create a stunning visual for this post.
    
    Return pure JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            captions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  style: { type: Type.STRING },
                  text: { type: Type.STRING }
                }
              }
            },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            imagePrompt: { type: Type.STRING },
          },
          required: ["captions", "hashtags", "imagePrompt"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Text Generation Error:", error);
    throw error;
  }
};

/**
 * Generates an image from a prompt with specific error handling for Quotas
 */
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    // Check if key is missing locally
    if (!process.env.API_KEY) {
      console.error("API KEY MISSING");
      return "https://placehold.co/1080x1350/1a1a1a/FFF?text=Missing+API+Key";
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: prompt }],
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return "https://placehold.co/1080x1350/1a1a1a/FFF?text=No+Image+Data";

  } catch (error: any) {
    console.error("IMAGE GENERATION FAILED:", error);
    
    // Check for Quota Exceeded (429)
    if (error.message?.includes('429') || error.message?.includes('quota') || error.status === 429) {
        return "https://placehold.co/1080x1350/2a1a1a/FFF?text=Quota+Exceeded+(429)";
    }
    
    return "https://placehold.co/1080x1350/1a1a1a/FFF?text=Generation+Error"; 
  }
};

/**
 * Generates marketing campaign content for a product
 */
export const generateCampaignContent = async (product: Product, contextNote: string): Promise<CampaignContent> => {
  const prompt = `
    Role: Marketing Campaign Creator.
    Product: ${product.title} (${product.category})
    Price: ${product.price}
    Features: ${product.features.join(', ')}
    
    Context: ${contextNote}
    
    Task:
    1. Write a catchy, high-conversion Instagram caption.
    2. Generate 10 relevant hashtags.
    3. Create a detailed prompt for generating a lifestyle marketing image for this product.
    
    Return pure JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          caption: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          imagePrompt: { type: Type.STRING },
        },
        required: ["caption", "hashtags", "imagePrompt"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

/**
 * Generates text embeddings for vector search
 */
export const getTextEmbedding = async (text: string): Promise<number[]> => {
  try {
    const response = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: text,
    });
    
    return response.embeddings?.[0]?.values || [];
  } catch (error) {
    console.error("Embedding error:", error);
    // Return zero vector if API fails to allow UI to continue
    return new Array(768).fill(0);
  }
};
