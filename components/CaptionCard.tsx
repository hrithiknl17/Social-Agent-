import React from 'react';
import { CaptionOption } from '../types';

interface CaptionCardProps {
  caption: CaptionOption;
  index: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
}

const CaptionCard: React.FC<CaptionCardProps> = React.memo(({ caption, index, isSelected, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(index)}
      className={`cursor-pointer p-5 rounded-xl border transition-all duration-200 group relative ${
        isSelected 
          ? 'bg-brand-900/20 border-brand-500 ring-1 ring-brand-500/50' 
          : 'bg-dark-card border-dark-border hover:border-dark-muted'
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
           isSelected ? 'bg-brand-500 text-white' : 'bg-dark-border text-dark-muted'
        }`}>
          {caption.style}
        </span>
        {isSelected && (
           <div className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
             <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
           </div>
        )}
      </div>
      <p className={`text-sm leading-relaxed ${isSelected ? 'text-white' : 'text-dark-muted group-hover:text-white'}`}>
        {caption.text}
      </p>
    </div>
  );
});

CaptionCard.displayName = 'CaptionCard';

export default CaptionCard;
