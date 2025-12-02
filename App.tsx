
import React, { useState } from 'react';
import { generateSocialContent, generateImage } from './services/geminiService';
import { SocialPostResult } from './types';
import Header from './components/Header';
import { 
  Sparkles, 
  Copy, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Loader2,
  Image as ImageIcon,
  Wand2,
  MoreHorizontal,
  ArrowRight
} from 'lucide-react';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<SocialPostResult | null>(null);
  const [selectedCaptionIndex, setSelectedCaptionIndex] = useState(0);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setResult(null); // Clear previous results
    setSelectedCaptionIndex(0);

    try {
      const content = await generateSocialContent(topic);
      const imageUrl = await generateImage(content.imagePrompt);
      setResult({ ...content, generatedImageUrl: imageUrl });
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentCaption = result ? result.captions[selectedCaptionIndex] : null;

  return (
    <div className="min-h-screen font-sans bg-dark-bg text-dark-text pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        
        {/* Hero / Input Section */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Create viral posts in <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-500">seconds</span>.
          </h1>
          <p className="text-dark-muted text-lg mb-8">
            Describe your product or idea, and we'll generate the image, caption, and hashtags instantly.
          </p>
          
          <form onSubmit={handleGenerate} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-600 to-purple-600 rounded-xl opacity-75 group-hover:opacity-100 transition duration-200 blur"></div>
            <div className="relative flex items-center bg-dark-card rounded-xl overflow-hidden">
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., A minimalist coffee shop in Tokyo..." 
                className="flex-1 bg-transparent border-none outline-none px-6 py-5 text-lg text-white placeholder:text-dark-muted"
                disabled={isGenerating}
              />
              <button 
                type="submit"
                disabled={!topic.trim() || isGenerating}
                className="mr-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                <span>Generate</span>
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
             <div className="w-16 h-16 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mb-6"></div>
             <p className="text-dark-muted text-lg animate-pulse">Designing your creative assets...</p>
          </div>
        )}

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-slide-up">
            
            {/* LEFT: Phone Preview (The "Ad") */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-[380px] bg-white rounded-[3rem] p-4 shadow-2xl border-8 border-gray-900 relative overflow-hidden">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20"></div>
                
                {/* Phone Screen */}
                <div className="bg-white w-full h-full rounded-[2rem] overflow-hidden flex flex-col text-black h-[750px] relative">
                  
                  {/* Instagram Header */}
                  <div className="px-4 pt-10 pb-3 flex items-center justify-between border-b border-gray-100">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
                          <div className="w-full h-full rounded-full bg-white p-[2px]">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=SocialSpark" alt="Profile" className="w-full h-full rounded-full bg-gray-100" />
                          </div>
                        </div>
                        <div className="flex flex-col leading-none">
                          <span className="font-semibold text-sm">social_spark_ai</span>
                          <span className="text-[10px] text-gray-500">Sponsored</span>
                        </div>
                     </div>
                     <MoreHorizontal className="w-5 h-5 text-gray-900" />
                  </div>

                  {/* Post Image */}
                  <div className="aspect-[4/5] bg-gray-100 relative group">
                    <img src={result.generatedImageUrl} alt="Generated Content" className="w-full h-full object-cover" />
                    
                    {/* Sponsored Overlay Button */}
                    <div className="absolute bottom-0 w-full bg-gray-900/80 backdrop-blur-sm p-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <span className="text-white text-sm font-medium">View Shop</span>
                       <ArrowRight className="text-white w-4 h-4" />
                    </div>
                  </div>

                  {/* Action Bar (Ad Style) */}
                  <div className="px-4 py-3 flex items-center justify-between bg-white relative z-10">
                    <div className="flex items-center gap-4">
                      <Heart className="w-6 h-6 hover:text-red-500 cursor-pointer transition-colors" />
                      <MessageCircle className="w-6 h-6 -rotate-90" />
                      <Share2 className="w-6 h-6" />
                    </div>
                    <Bookmark className="w-6 h-6" />
                  </div>
                  
                  {/* Call to Action Banner */}
                  <div className="mx-4 mb-2 bg-blue-50 px-3 py-2 rounded flex justify-between items-center cursor-pointer hover:bg-blue-100 transition-colors">
                     <span className="text-blue-700 text-xs font-semibold">Shop Now</span>
                     <span className="text-blue-700 text-xs">socialspark.ai &gt;</span>
                  </div>

                  {/* Caption Area */}
                  <div className="px-4 pb-8 flex-1 overflow-y-auto">
                    <p className="text-sm font-semibold mb-1">1,248 likes</p>
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold mr-2">social_spark_ai</span>
                      {currentCaption?.text}
                    </p>
                    <p className="text-brand-600 text-sm mt-2 leading-relaxed">
                      {result.hashtags.map(t => `#${t.replace('#', '')} `)}
                    </p>
                    <p className="text-gray-400 text-[10px] uppercase mt-2">2 hours ago</p>
                  </div>

                  {/* Bottom Nav Mockup */}
                  <div className="h-12 border-t border-gray-100 flex items-center justify-around px-2 text-gray-900">
                    <div className="w-6 h-6 rounded bg-black"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Editor & Options */}
            <div className="lg:col-span-7 space-y-8">
              
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-brand-500" />
                  Customization
                </h2>
                <button className="text-sm text-brand-500 hover:text-brand-400 font-medium">
                  Export All Assets
                </button>
              </div>

              {/* Caption Selector */}
              <div className="space-y-4">
                <h3 className="text-dark-muted uppercase tracking-wider text-xs font-semibold">Select Caption Style</h3>
                <div className="grid grid-cols-1 gap-4">
                  {result.captions.map((caption, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedCaptionIndex(idx)}
                      className={`cursor-pointer p-5 rounded-xl border transition-all duration-200 group relative ${
                        selectedCaptionIndex === idx 
                          ? 'bg-brand-900/20 border-brand-500 ring-1 ring-brand-500/50' 
                          : 'bg-dark-card border-dark-border hover:border-dark-muted'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                           selectedCaptionIndex === idx ? 'bg-brand-500 text-white' : 'bg-dark-border text-dark-muted'
                        }`}>
                          {caption.style}
                        </span>
                        {selectedCaptionIndex === idx && (
                           <div className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
                             <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                           </div>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed ${selectedCaptionIndex === idx ? 'text-white' : 'text-dark-muted group-hover:text-white'}`}>
                        {caption.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hashtag Cloud */}
              <div className="bg-dark-card rounded-xl border border-dark-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-dark-muted uppercase tracking-wider text-xs font-semibold">Optimized Hashtags</h3>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result.hashtags.join(' '))}
                    className="text-xs flex items-center gap-1 text-white hover:text-brand-500 transition-colors"
                  >
                    <Copy className="w-3 h-3" /> Copy All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.hashtags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 rounded-full bg-dark-bg border border-dark-border text-dark-muted text-sm hover:text-brand-400 hover:border-brand-500/50 transition-colors cursor-pointer select-none"
                    >
                      #{tag.replace('#', '')}
                    </span>
                  ))}
                </div>
              </div>

               {/* Image Prompt Info */}
               <div className="bg-dark-card rounded-xl border border-dark-border p-6 opacity-75 hover:opacity-100 transition-opacity">
                  <h3 className="text-dark-muted uppercase tracking-wider text-xs font-semibold mb-2 flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" />
                    AI Image Prompt Used
                  </h3>
                  <p className="text-xs text-dark-muted italic">
                    "{result.imagePrompt}"
                  </p>
               </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
