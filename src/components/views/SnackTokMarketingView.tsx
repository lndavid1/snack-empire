import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Send, 
  Megaphone, 
  Flame, 
  TrendingUp, 
  Sparkles,
  Users
} from 'lucide-react';

export const SnackTokMarketingView: React.FC = () => {
  const { 
    snackTokPosts, 
    postToSnackTok, 
    runMarketingCampaign, 
    money, 
    competitors,
    brandValue 
  } = useGameStore();

  const [customText, setCustomText] = useState('');

  const marketingCampaigns = [
    { id: 'mkt_flyer', name: 'Phát Tờ Rơi Giờ Tan Tầm', cost: 60, duration: 25, traffic: '1.4x', icon: '📄' },
    { id: 'mkt_led', name: 'Quảng Cáo Màn Hình LED Phố', cost: 350, duration: 45, traffic: '1.9x', icon: '💡' },
    { id: 'mkt_tiktoker', name: 'Thuê Idol SnackTok Ăn Thử', cost: 1200, duration: 60, traffic: '2.5x', icon: '🤳' },
    { id: 'mkt_viral', name: 'Chiến Dịch Meme Toàn Cõi Mạng', cost: 4500, duration: 90, traffic: '3.8x', icon: '🚀' },
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    postToSnackTok(customText);
    setCustomText('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Marketing Campaigns Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
        <div className="mb-4">
          <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-400" />
            Chiến Dịch Marketing Bùng Nổ
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Kéo lượng khách hàng khổng lồ tới quán trong thời gian ngắn!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {marketingCampaigns.map(camp => {
            const canAfford = money >= camp.cost;

            return (
              <div
                key={camp.id}
                className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-600 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{camp.icon}</span>
                    <span className="text-[11px] font-black text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                      Khách {camp.traffic}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-100 mb-1">
                    {camp.name}
                  </h4>
                  <div className="text-[11px] text-slate-400 mb-3">
                    Thời lượng: {camp.duration} giây
                  </div>
                </div>

                <button
                  onClick={() => runMarketingCampaign(camp.cost, camp.duration, camp.name)}
                  disabled={!canAfford}
                  className={`w-full py-2 px-3 rounded-xl font-black text-xs uppercase transition-all ${
                    canAfford
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  Chạy Chiến Dịch (${camp.cost.toLocaleString()})
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SnackTok Feed & Competitors Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: SnackTok Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎵</span>
                <h3 className="text-base font-extrabold text-slate-100">
                  SnackTok Live Feed
                </h3>
              </div>
              <span className="text-xs text-pink-400 font-extrabold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Bắt Trend Nhanh
              </span>
            </div>

            {/* Create Post Input */}
            <form onSubmit={handleCreatePost} className="mb-5 flex gap-2">
              <input
                type="text"
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="Đăng bài Gen Z meme câu view cho quán... 🔥🍔"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={!customText.trim()}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all disabled:opacity-40"
              >
                <span>Đăng</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Posts List */}
            <div className="space-y-3">
              {snackTokPosts.map(post => (
                <div
                  key={post.id}
                  className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 transition-all hover:border-slate-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-1 bg-slate-700 rounded-xl">
                        {post.avatar}
                      </span>
                      <div>
                        <div className="font-extrabold text-xs text-slate-100 flex items-center gap-1.5">
                          <span>{post.author}</span>
                          {post.isPlayerPost && (
                            <span className="text-[10px] bg-pink-500/20 text-pink-300 px-1.5 py-0.2 rounded font-bold border border-pink-500/30">
                              Quán của bạn
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {post.handle}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 mb-2 leading-relaxed font-medium">
                    {post.content}
                  </p>

                  <div className="text-[11px] font-bold text-sky-400 mb-3">
                    {post.trendTag}
                  </div>

                  <div className="flex items-center gap-5 text-slate-400 text-xs font-bold pt-2 border-t border-slate-700/60">
                    <span className="flex items-center gap-1 text-rose-400">
                      <Heart className="w-3.5 h-3.5 fill-rose-500" />
                      {post.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post.commentsCount}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Share2 className="w-3.5 h-3.5" />
                      {post.shares}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Market Competitors */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-extrabold text-slate-100">
                  Đối Thủ Cạnh Tranh
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                Thị trường ẩm thực
              </span>
            </div>

            <div className="space-y-3">
              {competitors.map(comp => (
                <div
                  key={comp.id}
                  className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-extrabold text-slate-200">
                      <span className="text-xl">{comp.logo}</span>
                      <span>{comp.name}</span>
                    </div>
                    <span className="text-xs font-black text-amber-400">
                      {comp.marketShare}% thị phần
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-medium">
                    {comp.flavor}
                  </p>

                  <div className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-700/50">
                    {comp.rivalryNote}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
