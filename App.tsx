
import React, { useState, useEffect, useRef } from 'react';
import { Search, Compass, Map as MapIcon, Loader2, Sparkles, Navigation, DollarSign, Crown } from 'lucide-react';
import { discoverVibes } from './services/geminiService';
import { SearchResult, Location } from './types';
import VibeCard from './components/VibeCard';
import ReactMarkdown from 'react-markdown';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false); // Monetization state simulation

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => console.warn("位置情報の取得に失敗しました", err)
      );
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await discoverVibes(query, location);
      setResult(data);
    } catch (err: any) {
      console.error("Search error:", err);
      const errorMessage = err?.message || "スカウト中にエラーが発生しました。もう一度お試しください。";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "ネオンが輝く読書コーナー",
    "静かなブルータリズム建築のカフェ",
    "ジャズが流れる隠れ家バー",
    "植物に囲まれた集中できるワークスペース",
    "ミニマリストなギャラリー併設コーヒーショップ"
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#0f172a] selection:bg-indigo-500/30">
      {/* Header / Monetization Banner */}
      <header className="w-full max-w-5xl px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2 group cursor-default flex-shrink-0">
          <div className="p-1.5 sm:p-2 bg-indigo-600 rounded-xl group-hover:rotate-12 transition-transform">
            <Compass className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">VibeScout</h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <button 
            onClick={() => setIsPremium(!isPremium)}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              isPremium 
                ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isPremium ? (
              <><Crown className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">バイブマスター有効</span><span className="sm:hidden">有効</span></>
            ) : (
              <><DollarSign className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">プレミアムにアップグレード</span><span className="sm:hidden">プレミアム</span></>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-12">
        {/* Search Section */}
        <section className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            あなたの居場所を、<br className="sm:hidden" />雰囲気で見つけよう。
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            AIが都市をキュレーション。今の気分にぴったりの「雰囲気」から現実の場所を探し出します。
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-6 sm:mb-8">
            <div className="relative group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="どんな雰囲気の場所を探していますか？"
                className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-4 sm:py-5 pl-12 sm:pl-14 pr-24 sm:pr-28 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-500 text-white shadow-2xl group-hover:border-slate-700 text-base sm:text-lg"
              />
              <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-700 text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-semibold transition-all text-base sm:text-lg shadow-lg active:scale-95 min-w-[70px] sm:min-w-[80px]"
              >
                {loading ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mx-auto" /> : '探す'}
              </button>
            </div>
          </form>

          <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2 sm:gap-3 px-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="text-sm sm:text-base font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-slate-800/60 text-slate-300 border border-slate-700 hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-slate-800/80 transition-all active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Results Section */}
        {error && (
          <div className="bg-red-500/10 border-2 border-red-500/30 text-red-400 p-4 sm:p-5 rounded-2xl text-center mb-6 sm:mb-12 text-base sm:text-lg font-medium">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Vibe Analysis - Full Width on Mobile */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 text-indigo-400 font-bold tracking-wider uppercase text-base sm:text-lg">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                雰囲気の分析
              </div>
              <div className="prose prose-invert prose-slate max-w-none text-slate-200 leading-relaxed bg-gradient-to-br from-slate-800/40 to-slate-900/40 p-5 sm:p-7 rounded-3xl border-2 border-slate-700/50 shadow-xl">
                <div className="text-base sm:text-lg">
                  <ReactMarkdown>{result.text}</ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Places Grid - Full Width on Mobile */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-indigo-400 font-bold tracking-wider uppercase text-base sm:text-lg">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <MapIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  見つかったスポット
                </div>
                {result.sources.length > 0 && (
                  <span className="text-sm sm:text-base text-slate-400 font-medium">
                    {result.sources.filter(s => s.maps).length}件
                  </span>
                )}
              </div>
              
              <div className="grid gap-4 sm:gap-5">
                {result.sources.length > 0 ? (
                  result.sources
                    .filter(source => source.maps)
                    .map((source, idx) => (
                      <VibeCard key={idx} source={source} index={idx + 1} />
                    ))
                ) : (
                  <div className="text-slate-400 text-center py-12 sm:py-16 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
                    <MapIcon className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                    <p className="text-base sm:text-lg">この検索条件に一致する詳細なマップデータが見つかりませんでした。</p>
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Monetization - Ad Spot */}
            <div className="p-5 sm:p-6 rounded-2xl border-2 border-dashed border-slate-600 bg-gradient-to-br from-slate-900/60 to-slate-800/40">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs sm:text-sm font-bold text-slate-400 tracking-wider uppercase">スポンサー提案</span>
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
              </div>
              <h4 className="text-white font-bold text-lg sm:text-xl mb-2">The Neon Foundry Coffee</h4>
              <p className="text-sm sm:text-base text-slate-300">インダストリアル×ネオンの旗艦店。コード「VISCOUT15」で15%オフ。</p>
            </div>

            {/* Pro Feature Teaser */}
            {!isPremium && (
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 sm:p-8 rounded-3xl relative overflow-hidden group shadow-xl">
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">「雰囲気トレイル」をアンロック</h3>
                  <p className="text-indigo-100 text-sm sm:text-base mb-4 sm:mb-5">完璧にマッチした雰囲気を巡る、あなただけの1日プランをAIが作成します。</p>
                  <button 
                    onClick={() => setIsPremium(true)}
                    className="bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg hover:scale-105 active:scale-95 transition-transform shadow-lg"
                  >
                    プロに参加する
                  </button>
                </div>
                <Navigation className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12 group-hover:rotate-6 transition-transform hidden sm:block" />
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-slate-500">
            <div className="p-6 bg-slate-800/30 rounded-full mb-6">
              <Compass className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600 animate-pulse" />
            </div>
            <p className="text-base sm:text-lg text-center px-4 max-w-md">上の検索バーから、今の気分を入力してスカウトを開始してください。</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-12 border-t border-slate-800 text-slate-500 text-xs sm:text-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">© 2024 VibeScout. 雰囲気検索エンジン.</div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="#" className="hover:text-indigo-400 transition-colors">ビジネス用ダッシュボード</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">プライバシー</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">利用規約</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
