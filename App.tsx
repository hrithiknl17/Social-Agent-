import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import BlueprintCard from './components/BlueprintCard';
import { AgentOrchestrator, ShopifyClient } from './services/stack';
import { Product, AgentLog, GeneratedCampaign } from './types';
import { Wand2, Loader2, Download, Terminal, Database, Brain, ShoppingBag } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [campaign, setCampaign] = useState<GeneratedCampaign | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [blueprintMode, setBlueprintMode] = useState(false);
  
  // Refs
  const logsEndRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<AgentOrchestrator | null>(null);

  // Initialize
  useEffect(() => {
    const client = new ShopifyClient();
    client.getProducts().then(setProducts);
    
    // Initialize Agent with a logger callback
    agentRef.current = new AgentOrchestrator((log) => {
      setLogs(prev => [...prev, log]);
    });
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleGenerate = async () => {
    if (!selectedProduct || !agentRef.current) return;
    
    setIsProcessing(true);
    setLogs([]); // Clear logs
    setCampaign(null);

    try {
      const result = await agentRef.current.runCampaignAgent(selectedProduct.id);
      setCampaign(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-brand-500/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT COLUMN: Input & Selection */}
        <div className="space-y-8">
          
          <div className="relative">
            <h1 className="text-5xl font-display font-bold mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              AI Marketing Agent
            </h1>
            <p className="text-gray-400 text-lg">
              Select a product to launch a full campaign. The agent will check past campaigns (Vector DB), generate content (LLM), and save results (Database).
            </p>
            
            <button 
              onClick={() => setBlueprintMode(!blueprintMode)}
              className={`mt-4 px-4 py-2 rounded-full text-sm font-bold border transition-all ${blueprintMode ? 'bg-brand-600 border-brand-500 text-white' : 'border-gray-700 text-gray-400 hover:text-white'}`}
            >
              {blueprintMode ? 'Hide Architecture' : 'Show Architecture'}
            </button>
          </div>

          {/* Product Selection */}
          <div className="space-y-4 relative">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-500" /> 
              Select Product (Shopify API)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedProduct?.id === p.id 
                      ? 'bg-brand-900/20 border-brand-500 ring-1 ring-brand-500' 
                      : 'bg-gray-900 border-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="font-bold text-white">{p.title}</div>
                  <div className="text-sm text-gray-500">{p.price} • {p.category}</div>
                </button>
              ))}
            </div>

            <BlueprintCard 
              isVisible={blueprintMode}
              title="Tool Usage"
              description="The agent connects to external APIs (like Shopify) to fetch real-time data context."
              techTerm="API Integration"
              iconType="code"
              className="top-0 right-0 translate-x-1/2"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedProduct || isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
              !selectedProduct || isProcessing
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-500 text-white hover:shadow-lg hover:shadow-brand-500/20'
            }`}
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <Wand2 />}
            {isProcessing ? 'Agent Working...' : 'Launch Campaign'}
          </button>

          {/* Agent Logs (The "Matrix" View) */}
          <div className="bg-black rounded-xl border border-gray-800 p-6 font-mono text-sm h-64 overflow-y-auto relative custom-scrollbar">
            <h4 className="text-gray-500 mb-4 flex items-center gap-2 sticky top-0 bg-black py-2 border-b border-gray-800">
              <Terminal className="w-4 h-4" /> Agent Live Logs
            </h4>
            <div className="space-y-3">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2">
                  <span className="text-gray-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className={`font-bold ${
                    log.type === 'success' ? 'text-green-400' :
                    log.type === 'warning' ? 'text-yellow-400' :
                    log.type === 'error' ? 'text-red-400' : 'text-blue-400'
                  }`}>
                    [{log.step}]
                  </span>
                  <span className="text-gray-300">{log.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            <BlueprintCard 
              isVisible={blueprintMode}
              title="Orchestration Framework"
              description="The 'Brain' coordinates steps: fetching data, checking Vector DB, calling LLM, and saving results."
              techTerm="Agent Framework"
              iconType="bot"
              className="bottom-4 right-4 translate-x-1/2"
            />
          </div>

        </div>

        {/* RIGHT COLUMN: Result */}
        <div className="relative">
          {campaign ? (
            <div className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 animate-in zoom-in-95 duration-500">
              {/* Image */}
              <div className="relative group">
                <img src={campaign.imageUrl} alt="Campaign" className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <p className="text-white font-bold mb-2">AI Generated Visual</p>
                  <button className="bg-white text-black px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 w-fit">
                    <Download className="w-4 h-4" /> Download
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500" />
                  <div>
                    <p className="font-bold">Social Spark</p>
                    <p className="text-xs text-gray-400">Sponsored • {campaign.productName}</p>
                  </div>
                </div>

                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap mb-6">
                  {campaign.caption}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {campaign.hashtags.map(tag => (
                    <span key={tag} className="text-brand-400 text-sm">#{tag}</span>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-800 flex justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Database className="w-3 h-3"/> Saved to Database</span>
                  <span className="flex items-center gap-1"><Brain className="w-3 h-3"/> Indexed in Vector DB</span>
                </div>
              </div>

              <BlueprintCard 
                isVisible={blueprintMode}
                title="Database & Vector DB"
                description="The final result is saved for future history, and its 'Embedding' is stored to prevent duplicates next time."
                techTerm="Data Persistence"
                iconType="db"
                className="top-1/2 -left-4 -translate-x-full"
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-800 rounded-3xl bg-gray-900/50">
              <div className="text-center text-gray-600">
                <Brain className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Select a product and launch to see the result</p>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default App;