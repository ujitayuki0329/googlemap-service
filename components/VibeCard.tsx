
import React from 'react';
import { ExternalLink, MapPin, Sparkles } from 'lucide-react';
import { GroundingChunk } from '../types';

interface VibeCardProps {
  source: GroundingChunk;
}

const VibeCard: React.FC<VibeCardProps> = ({ source }) => {
  // Guard against missing maps, title, or uri as these are optional in the @google/genai response
  if (!source.maps || !source.maps.title || !source.maps.uri) return null;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 hover:border-indigo-500/50 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
            <MapPin className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="font-semibold text-lg text-slate-100">{source.maps.title}</h3>
        </div>
        <a 
          href={source.maps.uri} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"
          title="Googleマップで開く"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>
      
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-700 text-slate-300 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-300" />
          認証済みスポット
        </span>
      </div>
    </div>
  );
};

export default VibeCard;
