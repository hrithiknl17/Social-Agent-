export enum AgentState {
  IDLE = 'IDLE',
  THINKING_IDEAS = 'THINKING_IDEAS',
  IDEAS_READY = 'IDEAS_READY',
  GENERATING_POST = 'GENERATING_POST',
  POST_READY = 'POST_READY',
  ERROR = 'ERROR'
}

export interface PostIdea {
  id: number;
  title: string;
  description: string;
}

export interface GeneratedPost {
  caption: string;
  hashtags: string[];
  imageUrl?: string;
}

// --- NEW TYPES FOR FULL STACK ---

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
  metadata: Record<string, any>;
  embedding: number[];
}

export interface AgentLog {
  step: string;
  message: string;
  timestamp: number;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface SocialPostResult {
  captions: { style: string; text: string }[];
  hashtags: string[];
  imagePrompt: string;
}

export interface CampaignContent {
  caption: string;
  hashtags: string[];
  imagePrompt: string;
}