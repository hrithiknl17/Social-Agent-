
import { GoogleGenAI, Type } from "@google/genai";
import { SocialPostResult, Product, CampaignContent } from "../types";

// NOTE: For local development, ensure process.env.API_KEY is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- CACHING & RETRY LOGIC ---

// Simple in-memory cache to save API quota during testing
const contentCache = new Map<string, SocialPostResult>();
const imageCache = new Map<string, string>();

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Wraps an async function with retry logic for handling 429 errors.
 * Uses exponential backoff (waits 2s, then 4s, then 8s).
 */
async function withRetry<T>(operation: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    const isQuotaError = error.status === 429 || error.message?.includes('429') || error.message?.includes('quota');
    
    if (isQuotaError && retries > 0) {
      console.warn(`Quota limit hit (429). Retrying in ${delay}ms... (${retries} attempts left)`);
      await sleep(delay);
      return withRetry(operation, retries - 1, delay * 2);
    }
    
    throw error;
  }
}

// --- MOCK FALLBACK GENERATORS (FOR DEMO STABILITY) ---

const getMockSocialResult = (topic: string): SocialPostResult => {
  const t = topic.trim();
  const titleCase = t.charAt(0).toUpperCase() + t.slice(1);
  
  // Use Pollinations AI for relevant fallback images based on topic
  const fallbackImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(t + " aesthetic social media photography high quality")}?width=1080&height=1350&nologo=true`;

  return {
    captions: [
      {
        style: "Witty",
        text: `POV: You just discovered the best ${t} in the game. You're welcome. 😎 #LifeHack`
      },
      {
        style: "Professional",
        text: `Experience the difference with our premium ${t}. Designed for those who appreciate excellence and attention to detail.`
      },
      {
        style: "Minimalist",
        text: `${titleCase}. Pure and simple.`
      }
    ],
    hashtags: [`#${titleCase.replace(/\s/g, '')}`, `#Love${titleCase.replace(/\s/g, '')}`, "#Trending", "#Inspiration", "#DailyGrind", "#Viral", "#ExplorePage"],
    imagePrompt: `A high-quality, professional photograph of ${t}, cinematic lighting, 4k resolution, trending on artstation`,
    generatedImageUrl: fallbackImage
  };
};

// --- API FUNCTIONS ---

/**
 * Generates social media content (captions, hashtags, image prompt) from a text topic
 */
export const generateSocialContent = async (topic: string): Promise<SocialPostResult> => {
  // 1. Check Cache first
  if (contentCache.has(topic.toLowerCase())) {
    console.log("Serving from cache (Saving Quota!)");
    return contentCache.get(topic.toLowerCase())!;
  }

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
    // 2. Wrap API call in Retry Logic
    const response = await withRetry(async () => {
      return await ai.models.generateContent({
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
    });

    const result = JSON.parse(response.text || "{}");
    
    // 3. Save to Cache
    contentCache.set(topic.toLowerCase(), result);
    
    return result;
  } catch (error: any) {
    console.error("Text Generation Error:", error);
    
    // FALLBACK: If API fails (Quota or Network), return Mock Data so the demo continues
    if (error.status === 429 || error.message?.includes('429')) {
       console.warn("Using Mock Data Fallback due to Quota Limit.");
       const mockResult = getMockSocialResult(topic);
       contentCache.set(topic.toLowerCase(), mockResult);
       return mockResult;
    }
    
    throw error;
  }
};

/**
 * Generates an image from a prompt with specific error handling for Quotas
 */
export const generateImage = async (prompt: string): Promise<string> => {
  // 1. Check Cache
  const cacheKey = prompt.substring(0, 50); // Use first 50 chars as key
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  try {
    if (!process.env.API_KEY) {
      throw new Error("API KEY MISSING");
    }

    // 2. Wrap API call in Retry Logic
    const response = await withRetry(async () => {
        return await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: {
            parts: [{ text: prompt }],
          },
        });
    }, 2, 3000); // 2 Retries, start with 3s delay for images

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
           imageCache.set(cacheKey, imageUrl);
           return imageUrl;
        }
      }
    }
    
    throw new Error("No image data in response");

  } catch (error: any) {
    console.error("IMAGE GENERATION FAILED:", error);
    
    // FALLBACK: Use Pollinations AI to generate a REAL relevant image based on the prompt
    // This allows the app to function visually even without Gemini quota
    const encodedPrompt = encodeURIComponent(prompt.slice(0, 100)); // Limit length for URL
    const fallbackImage = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1350&nologo=true`;
    
    console.warn("Using Pollinations.ai fallback image");
    
    // Cache the fallback so it doesn't flicker
    imageCache.set(cacheKey, fallbackImage);
    
    return fallbackImage;
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

  // Apply the same fallback logic for campaign generation
  try {
    const response = await withRetry(async () => {
        return await ai.models.generateContent({
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
    });
    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    if (error.status === 429 || error.message?.includes('429')) {
      return {
        caption: `Discover the new ${product.title}. The perfect blend of style and function. Get yours today!`,
        hashtags: ["#NewArrival", `#${product.category.replace(/\s/g, '')}`, "#ShopNow"],
        imagePrompt: `Professional product photography of ${product.title} ${product.category}`
      };
    }
    throw error;
  }
};

/**
 * Generates text embeddings for vector search
 */
export const getTextEmbedding = async (text: string): Promise<number[]> => {
  try {
    const response = await withRetry(async () => {
        return await ai.models.embedContent({
          model: "text-embedding-004",
          contents: text,
        });
    });
    
    return response.embeddings?.[0]?.values || [];
  } catch (error) {
    console.error("Embedding error:", error);
    // Return zero vector if API fails to allow UI to continue
    return new Array(768).fill(0);
  }
};
