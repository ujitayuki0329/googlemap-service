
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
      <header className="w-full max-w-5xl px-6 py-6 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="p-2 bg-indigo-600 rounded-xl group-hover:rotate-12 transition-transform">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">VibeScout</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPremium(!isPremium)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              isPremium 
                ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isPremium ? (
              <><Crown className="w-4 h-4" /> バイブマスター有効</>
            ) : (
              <><DollarSign className="w-4 h-4" /> プレミアムにアップグレード</>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl px-6 py-12">
        {/* Search Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            あなたの居場所を、雰囲気で見つけよう。
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            AIが都市をキュレーション。今の気分にぴったりの「雰囲気」から現実の場所を探し出します。
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="relative group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="どんな雰囲気の場所を探していますか？ (例: ベルベットの椅子がある落ち着いたバー)"
                className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-4 px-12 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-600 text-white shadow-2xl group-hover:border-slate-700"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white px-6 py-2 rounded-xl font-medium transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '探す'}
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-800/50 text-slate-400 border border-slate-800 hover:border-indigo-500/50 hover:text-indigo-400 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Results Section */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center mb-12">
            {error}
          </div>
        )}

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Vibe Analysis */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-400 font-bold tracking-wider uppercase text-sm">
                <Sparkles className="w-4 h-4" />
                雰囲気の分析
              </div>
              <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed bg-slate-800/20 p-6 rounded-2xl border border-slate-800/50">
                <ReactMarkdown>{result.text}</ReactMarkdown>
              </div>
              
              {/* Simulated Monetization - Ad Spot */}
              <div className="p-6 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">スポンサー提案</span>
                  <DollarSign className="w-3 h-3 text-slate-500" />
                </div>
                <h4 className="text-white font-semibold">The Neon Foundry Coffee</h4>
                <p className="text-sm text-slate-400 mt-1">インダストリアル×ネオンの旗艦店。コード「VISCOUT15」で15%オフ。</p>
              </div>
            </div>

            {/* Places Grid */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-400 font-bold tracking-wider uppercase text-sm">
                <MapIcon className="w-4 h-4" />
                見つかったスポット
              </div>
              <div className="grid gap-4">
                {result.sources.length > 0 ? (
                  result.sources.map((source, idx) => (
                    source.maps ? <VibeCard key={idx} source={source} /> : null
                  ))
                ) : (
                  <div className="text-slate-500 text-center py-12 border border-dashed border-slate-800 rounded-2xl">
                    この検索条件に一致する詳細なマップデータが見つかりませんでした。
                  </div>
                )}
              </div>

              {/* Pro Feature Teaser */}
              {!isPremium && (
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2">「雰囲気トレイル」をアンロック</h3>
                    <p className="text-indigo-100 text-sm mb-4">完璧にマッチした雰囲気を巡る、あなただけの1日プランをAIが作成します。</p>
                    <button 
                      onClick={() => setIsPremium(true)}
                      className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
                    >
                      プロに参加する
                    </button>
                  </div>
                  <Navigation className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12 group-hover:rotate-6 transition-transform" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-600">
            <Compass className="w-16 h-16 mb-4 opacity-10" />
            <p className="text-sm">上の検索バーから、今の気分を入力してスカウトを開始してください。</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl px-6 py-12 border-t border-slate-800 text-slate-500 text-xs flex justify-between items-center">
        <div>© 2024 VibeScout. 雰囲気検索エンジン.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-indigo-400 transition-colors">ビジネス用ダッシュボード</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">プライバシー</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">利用規約</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
