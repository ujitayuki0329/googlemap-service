
import React from 'react';
import { ExternalLink, MapPin, Sparkles, Navigation2 } from 'lucide-react';
import { GroundingChunk } from '../types';

interface VibeCardProps {
  source: GroundingChunk;
  index?: number;
}

const VibeCard: React.FC<VibeCardProps> = ({ source, index }) => {
  // Guard against missing maps, title, or uri as these are optional in the @google/genai response
  if (!source.maps || !source.maps.title || !source.maps.uri) return null;

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 border-2 border-slate-700/50 rounded-3xl p-5 sm:p-6 hover:border-indigo-500/70 transition-all duration-300 group shadow-lg hover:shadow-xl active:scale-[0.98]">
      <div className="flex items-start gap-4 mb-4">
        {/* Index Badge */}
        {index !== undefined && (
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
            {index}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-bold text-lg sm:text-xl text-slate-100 leading-tight group-hover:text-indigo-300 transition-colors flex-1">
              {source.maps.title}
            </h3>
            <a 
              href={source.maps.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-shrink-0 p-2.5 sm:p-3 bg-slate-700/50 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-xl transition-all active:scale-95 shadow-md"
              title="Googleマップで開く"
            >
              <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              認証済みスポット
            </span>
            <a
              href={source.maps.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600/50 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Navigation2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              マップで見る
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibeCard;
