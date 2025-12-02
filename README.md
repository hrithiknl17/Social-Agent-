🚀 Social Spark - Autonomous Marketing Agent

Social Spark is an intelligent AI Agent designed to automate the creative workflow for social media managers. Unlike simple text generators, it acts as a digital employee: connecting to product inventory, referencing past campaigns (RAG), and orchestrating multimodal assets.

🏆 Project Highlight: Built with a "Graceful Degradation" architecture, ensuring 100% uptime by automatically switching between AI models during high traffic.

🌟 Core Capabilities

1. 🧠 Agentic Workflow

The system doesn't just "guess." It follows a structured chain of thought:

Perception: Reads product data (Price, Features) from a mock Shopify API.

Memory (RAG): Checks a local Vector Database for past campaigns to ensure brand consistency.

Action: Generates unique captions and visual assets based on this context.

2. 🛡️ Fail-Safe Architecture (Graceful Degradation)

Real-world APIs have limits. Social Spark implements a robust fallback system:

Primary Line: Google Gemini 1.5 Flash (Text) + Imagen 3 (Vision).

Safety Net: If Google's API hits a rate limit (429) or goes down, the system automatically reroutes image generation requests to Pollinations.ai (Stable Diffusion).

Result: The user never sees an error screen, only results.

3. 🎨 Multimodal Generation

Multi-Tone Copy: Generates Witty, Professional, and Minimalist variations.

Visuals: Creates high-fidelity lifestyle photography matching the caption context.

Hashtags: Auto-generates high-ranking, relevant tags.

🛠️ Tech Stack

Frontend: React 19, TypeScript, Vite

Styling: Tailwind CSS (Glassmorphism UI)

AI Orchestration: Google GenAI SDK

LLM (Brain): Gemini 1.5 Flash

Image Models: Gemini Imagen (Primary) → Pollinations.ai (Fallback)

Vector Database: Custom Local Cosine Similarity Engine (Simulating Pinecone)

🏗️ Architecture Flow

The agent follows a decision tree to ensure reliability:

graph TD
    User((User)) -->|1. Topic/Product| UI[React Frontend]
    UI -->|2. Context Prompt| Agent[Agent Orchestrator]
    
    subgraph "The Brain (Gemini 1.5)"
        Agent -->|3. Generate Text| LLM[Gemini Flash]
    end
    
    subgraph "Visual Engine (Redundant)"
        LLM -->|4. Prompt| Vision{Try Imagen?}
        Vision -->|Success| Img1[Google Imagen]
        Vision -->|Error / 429| Fallback[Pollinations.ai]
    end
    
    Img1 -->|5. Image URL| UI
    Fallback -->|5. Image URL| UI
    LLM -->|5. Captions| UI


🚀 Local Setup

Clone the repository

git clone [https://github.com/hrithiknl17/social-agent.git](https://github.com/hrithiknl17/social-agent.git)
cd social-agent


Install Dependencies

npm install


Set up Environment
Create a .env file in the root:

VITE_GEMINI_API_KEY=your_api_key_here


Run Development Server

npm run dev


🔮 Future Roadmap

[ ] Auth: User accounts to save campaign history (Firebase Auth).

[ ] Direct Publishing: Instagram Graph API integration.

[ ] Video: AI Video generation for Reels using Gemini 1.5 Pro.
