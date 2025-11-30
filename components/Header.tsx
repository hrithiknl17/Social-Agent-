import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-dark-border bg-dark-bg/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-brand-600 to-purple-600 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            SocialSpark
          </span>
        </div>

        <div className="flex items-center gap-4">
           <span className="text-xs font-medium px-2 py-1 bg-dark-border rounded-full text-dark-muted">
             Creative Studio
           </span>
        </div>
      </div>
    </header>
  );
};

export default Header;