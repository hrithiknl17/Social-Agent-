import React from 'react';
import { Bot, Code, Database, Sparkles } from 'lucide-react';

interface BlueprintCardProps {
  isVisible: boolean;
  title: string;
  description: string;
  techTerm: string;
  iconType?: 'bot' | 'code' | 'db' | 'sparkles';
  className?: string;
}

const BlueprintCard: React.FC<BlueprintCardProps> = ({ isVisible, title, description, techTerm, iconType = 'code', className = '' }) => {
  if (!isVisible) return null;

  const getIcon = () => {
    switch (iconType) {
      case 'bot': return <Bot className="w-4 h-4 text-white" />;
      case 'sparkles': return <Sparkles className="w-4 h-4 text-white" />;
      case 'db': return <Database className="w-4 h-4 text-white" />;
      default: return <Code className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className={`absolute z-20 -right-4 -top-4 w-64 ${className}`}>
      <div className="bg-cyber-panel text-white p-4 rounded shadow-lg border border-cyber-border">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-cyber-border/50">
          <div className="p-1 bg-cyber-dark rounded">
            {getIcon()}
          </div>
          <span className="font-display font-bold text-xs uppercase tracking-wider text-cyber-cyan">
            System Logic
          </span>
        </div>
        <h4 className="font-bold text-sm mb-1">{title}</h4>
        <p className="text-xs text-cyber-muted mb-2 leading-relaxed">{description}</p>
        <div className="inline-block bg-cyber-black px-2 py-1 rounded text-[10px] font-mono text-emerald-400 border border-cyber-border/50">
          {techTerm}
        </div>
      </div>
    </div>
  );
};

export default BlueprintCard;