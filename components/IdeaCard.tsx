import React from 'react';
import { PostIdea } from '../types';
import { ArrowRight, Star } from 'lucide-react';

interface IdeaCardProps {
  idea: PostIdea;
  onSelect: (idea: PostIdea) => void;
  disabled: boolean;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onSelect, disabled }) => {
  return (
    <button
      onClick={() => onSelect(idea)}
      disabled={disabled}
      className="group relative w-full text-left p-6 bg-white rounded-2xl border-2 border-slate-100 shadow-sm hover:border-brand-500 hover:shadow-brand-100 transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-800 mb-2 group-hover:text-brand-600 transition-colors">
            {idea.title}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {idea.description}
          </p>
        </div>
        <div className="p-3 bg-brand-50 rounded-full group-hover:bg-brand-500 transition-colors">
          <ArrowRight className="w-5 h-5 text-brand-500 group-hover:text-white transition-colors" />
        </div>
      </div>
      
      {/* Decorative Star */}
      <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity transform -rotate-12">
        <Star className="w-8 h-8 text-fun-yellow fill-current" />
      </div>
    </button>
  );
};

export default IdeaCard;