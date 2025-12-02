
export interface CaptionOption {
  style: string;
  text: string;
}

export interface SocialPostResult {
  captions: CaptionOption[];
  hashtags: string[];
  imagePrompt: string;
  generatedImageUrl?: string;
}

export interface PostIdea {
  title: string;
  description: string;
}

export interface Product {
  id: string;
  title: string;
  price: string;
  category: string;
  features: string[];
  imageUrl: string;
}

export interface GeneratedCampaign {
  id: string;
  productId: string;
  productName: string;
  caption: string;
  hashtags: string[];
  imageUrl: string;
  timestamp: number;
  embedding: number[];
}

export interface VectorDocument {
  id: string;
  content: string;
  metadata: {
    title: string;
  };
  embedding: number[];
  score?: number;
}

export interface AgentLog {
  step: string;
  message: string;
  timestamp: number;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface CampaignContent {
  caption: string;
  hashtags: string[];
  imagePrompt: string;
}
