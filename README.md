🚀 Social Spark - AI Social Media Agent

Social Spark is an intelligent AI Agent designed to automate the creative process for social media managers. It instantly brainstorms viral post ideas, writes engaging captions in multiple tones, generates optimized hashtags, and creates stunning visual assets—all from a single topic input.

🌟 Overview

The goal of Social Spark is to solve the "Blank Page Problem" for content creators. Instead of spending hours brainstorming and designing, users can input a simple topic (e.g., "Minimalist Coffee Shop") and receive a production-ready social media post in seconds.

Key Capabilities:

Instant Brainstorming: Generates creative post concepts on demand.

Multi-Tone Copywriting: Writes captions in Witty, Professional, and Minimalist styles.

Visual Generation: Creates high-quality, aesthetic images tailored to the post.

Hashtag Optimization: Suggests relevant, high-traffic hashtags.

✨ Features & Limitations

Features

One-Click Generation: Input a topic, get a full post.

Live Preview: See exactly how your post will look on a smartphone screen (Instagram-style mockups).

Customization: Switch between different caption styles instantly.

Smart Clipboard: Copy captions and hashtags with a single click.

Responsive Design: Works beautifully on desktop and mobile.

Limitations

Image Consistency: AI-generated images may occasionally include garbled text (a known limitation of current diffusion models).

Video Content: Currently supports static images only, not Reels/TikToks.

API Rate Limits: Heavy usage may hit the free tier limits of the underlying AI models.

🛠️ Tech Stack & APIs

This agent is built using a modern, scalable web stack:

Frontend Framework: React 19 + Vite (TypeScript)

Styling: Tailwind CSS + Lucide React (Icons)

AI Model (Text): Google Gemini 1.5 Flash (via Google GenAI SDK)

AI Model (Image): Pollinations.ai (Stable Diffusion)

Hosting: Vercel / Localhost

🏗️ Architecture Diagram

The agent follows a direct, low-latency architecture:

graph LR
    subgraph Client ["Frontend (Your Computer)"]
        User((User))
        UI[Social Spark App\n(React + Vite)]
    end

    subgraph AI_Cloud ["Google Cloud"]
        Gemini[Google Gemini 1.5 Flash\n(Generates Captions, Hashtags & Visuals)]
    end

    %% Flow
    User -- "1. Enters Topic" --> UI
    
    UI -- "2. Sends Context Prompt" --> Gemini
    
    Gemini -- "3. Returns JSON Data\n(Captions + Image URL)" --> UI
    
    UI -- "4. Renders Content" --> User

    %% Styling
    style UI fill:#0ea5e9,stroke:#0369a1,color:white
    style Gemini fill:#f59e0b,stroke:#b45309,color:white
    style User fill:#333,stroke:#fff,color:white


🚀 Setup & Run Instructions

Follow these steps to run the agent on your local machine:

Clone the Repository

git clone <your-repo-link>
cd social-spark


Install Dependencies

npm install


Configure API Keys
Create a file named .env.local in the root directory and add your Gemini API Key:

VITE_GEMINI_API_KEY=AIzaSy...Your_Key_Here...


Run the App

npm run dev


Open your browser to http://localhost:5173.

🔮 Potential Improvements

User Accounts: Add Firebase Auth to save post history for each user.

Direct Publishing: Integrate Instagram/LinkedIn APIs to publish posts directly from the app.

Video Support: Add AI video generation for Reels/TikTok content.

Scheduling: Include a calendar view to plan posts for the week.
