import { Product, GeneratedCampaign, VectorDocument, AgentLog } from '../types';
import { generateCampaignContent, generateImage, getTextEmbedding } from './geminiService';

// --- 1. API LAYER: Mock Shopify Client ---
export class ShopifyClient {
  private products: Product[] = [
    {
      id: 'prod_001',
      title: 'Nebula Runner 2025',
      price: '$149.99',
      category: 'Footwear',
      features: ['Anti-gravity sole', 'Bioluminescent trim', 'Self-lacing'],
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'prod_002',
      title: 'Quantum Noise-Cancel Headset',
      price: '$299.00',
      category: 'Electronics',
      features: ['AI Audio Scaling', '100hr Battery', 'Holographic Display'],
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'prod_003',
      title: 'Eco-Smart Water Bottle',
      price: '$45.00',
      category: 'Lifestyle',
      features: ['Hydration Tracking', 'Self-cleaning UV', 'Temperature Control'],
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-011141951f7c?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'prod_004',
      title: 'Cyberpunk Desk Lamp',
      price: '$89.50',
      category: 'Home Decor',
      features: ['RGB Sync', 'Voice Control', 'Wireless Charging Base'],
      imageUrl: 'https://images.unsplash.com/photo-1534073828943-f801091a7174?auto=format&fit=crop&w=300&q=80'
    }
  ];

  async getProducts(): Promise<Product[]> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));
    return this.products;
  }
}

// --- 2. VECTOR DB LAYER: Local Vector Store (Simulating Pinecone/Chroma) ---
export class LocalVectorStore {
  private documents: VectorDocument[] = [];

  constructor() {
    // Load existing index from local storage if available
    const saved = localStorage.getItem('vector_index');
    if (saved) {
      this.documents = JSON.parse(saved);
    }
  }

  async addDocument(doc: VectorDocument) {
    this.documents.push(doc);
    this.save();
  }

  private save() {
    localStorage.setItem('vector_index', JSON.stringify(this.documents));
  }

  // Simple Cosine Similarity Search
  async similaritySearch(queryEmbedding: number[], topK: number = 2): Promise<VectorDocument[]> {
    if (this.documents.length === 0) return [];

    const scoredDocs = this.documents.map(doc => {
      const score = this.cosineSimilarity(queryEmbedding, doc.embedding);
      return { ...doc, score };
    });

    // Sort by score descending
    scoredDocs.sort((a, b) => b.score - a.score);
    return scoredDocs.slice(0, topK);
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB || 1);
  }
}

// --- 3. DATABASE LAYER: Content DB (Simulating Supabase/Firebase) ---
export class ContentDatabase {
  private readonly STORAGE_KEY = 'content_db_records';

  async saveCampaign(campaign: GeneratedCampaign): Promise<void> {
    const current = await this.getCampaigns();
    current.unshift(campaign);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(current));
  }

  async getCampaigns(): Promise<GeneratedCampaign[]> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}

// --- 4. FRAMEWORK LAYER: Agent Orchestrator (Simulating LangChain/CrewAI) ---
export class AgentOrchestrator {
  private shopify: ShopifyClient;
  private vectorStore: LocalVectorStore;
  private db: ContentDatabase;
  private logger: (log: AgentLog) => void;

  constructor(logger: (log: AgentLog) => void) {
    this.shopify = new ShopifyClient();
    this.vectorStore = new LocalVectorStore();
    this.db = new ContentDatabase();
    this.logger = logger;
  }

  private log(step: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    this.logger({ step, message, timestamp: Date.now(), type });
  }

  async runCampaignAgent(productId: string) {
    try {
      // Step 1: Fetch Data (Tool Usage)
      this.log('Shopify API', `Fetching product details for ID: ${productId}...`);
      const products = await this.shopify.getProducts();
      const product = products.find(p => p.id === productId);
      
      if (!product) throw new Error("Product not found");
      this.log('Shopify API', `Retrieved: ${product.title} ($${product.price})`, 'success');

      // Step 2: Vector Context Retrieval (RAG)
      this.log('Vector DB', 'Generating embedding for context search...');
      const productEmbedding = await getTextEmbedding(`${product.title} ${product.category}`);
      
      this.log('Vector DB', 'Querying Pinecone-lite for similar past campaigns...');
      const similarDocs = await this.vectorStore.similaritySearch(productEmbedding);
      
      let contextNote = "";
      if (similarDocs.length > 0 && (similarDocs[0] as any).score > 0.8) {
         this.log('Vector DB', `Found ${similarDocs.length} similar past campaigns. Adjusting creativity to avoid duplicates.`, 'warning');
         contextNote = `NOTE: We have previously promoted similar items: ${similarDocs.map(d => d.metadata.title).join(', ')}. Ensure this new post is distinct and fresh.`;
      } else {
         this.log('Vector DB', 'No similar semantic matches found. Context is clear.', 'success');
      }

      // Step 3: LLM Generation (Gemini)
      this.log('Gemini AI', 'Orchestrating prompt with RAG context...');
      const content = await generateCampaignContent(product, contextNote);
      this.log('Gemini AI', 'Text content generated successfully.', 'success');

      // Step 4: Image Generation (Tool)
      this.log('Gemini Image', 'Generating marketing visual...');
      const imageUrl = await generateImage(content.imagePrompt);
      this.log('Gemini Image', 'Visual asset rendered.', 'success');

      // Step 5: Save to DB & Update Vector Index
      const campaign: GeneratedCampaign = {
        id: crypto.randomUUID(),
        productId: product.id,
        productName: product.title,
        caption: content.caption,
        hashtags: content.hashtags,
        imageUrl: imageUrl,
        timestamp: Date.now(),
        embedding: productEmbedding
      };

      this.log('Database', 'Saving campaign to ContentDB (Supabase-lite)...');
      await this.db.saveCampaign(campaign);

      this.log('Vector DB', 'Indexing new campaign embedding for future RAG...', 'info');
      await this.vectorStore.addDocument({
        id: campaign.id,
        content: `${product.title} ${product.category} ${content.caption}`,
        metadata: { title: product.title },
        embedding: productEmbedding
      });

      this.log('Agent', 'Workflow completed successfully.', 'success');
      return campaign;

    } catch (error: any) {
      this.log('Error', error.message || "Unknown error", 'error');
      throw error;
    }
  }
}