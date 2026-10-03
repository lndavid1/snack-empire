import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Trophy, Gift, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuestsAchievementsView: React.FC = () => {
  const { quests, achievements, claimQuest } = useGameStore();
  const [activeSection, setActiveSection] = useState<'quests' | 'achievements'>('quests');

  const pendingQuests = quests.filter(q => q.completed && !q.claimed);

  const handleClaim = (id: string) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    claimQuest(id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Switcher Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setActiveSection('quests')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all ${
            activeSection === 'quests'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Nhiệm Vụ Doanh Nghiệp</span>
          {pendingQuests.length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full animate-bounce">
              {pendingQuests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSection('achievements')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all ${
            activeSection === 'achievements'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Thành Tựu Meme Gen Z</span>
        </button>
      </div>

      {activeSection === 'quests' ? (
        /* Quests Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quests.map(q => {
            const progressPercent = Math.min(100, Math.round((q.progress / q.target) * 100));

            return (
              <div
                key={q.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                  q.claimed
                    ? 'bg-slate-900/60 border-slate-800/60 opacity-60'
                    : q.completed
                    ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-slate-800 rounded-2xl border border-slate-700">
                        {q.icon}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-100">
                          {q.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">
                          {q.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 mb-4">
                    <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                      <span>Tiến độ</span>
                      <span>{q.progress} / {q.target} ({progressPercent}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          q.completed ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Rewards preview */}
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-300 mb-4">
                    <span className="text-emerald-400">+${q.rewardCash.toLocaleString()}</span>
                    <span className="text-amber-400">+{q.rewardXP} XP</span>
                    {q.rewardEmpirePoints && (
                      <span className="text-purple-400">+{q.rewardEmpirePoints} Empire Pts ⭐</span>
                    )}
                  </div>
                </div>

                {/* Claim Button */}
                <div>
                  {q.claimed ? (
                    <div className="w-full py-2.5 rounded-xl bg-slate-800/60 text-slate-500 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Đã nhận thưởng
                    </div>
                  ) : q.completed ? (
                    <button
                      onClick={() => handleClaim(q.id)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                    >
                      <Gift className="w-4 h-4" /> NHẬN THƯỞNG NGAY! 🎁
                    </button>
                  ) : (
                    <div className="w-full py-2.5 rounded-xl bg-slate-800/80 text-slate-400 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                      <Clock className="w-4 h-4" /> Đang thực hiện...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Achievements Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-4 rounded-3xl border transition-all flex flex-col justify-between ${
                ach.unlocked
                  ? 'bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border-amber-500/60 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-4xl p-2 rounded-2xl border ${
                    ach.unlocked
                      ? 'bg-amber-500/20 border-amber-500/40'
                      : 'bg-slate-800 border-slate-700 grayscale'
                  }`}>
                    {ach.icon}
                  </span>
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${
                    ach.unlocked
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}>
                    +{ach.rewardEmpirePoints} ⭐
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-100 mb-1">
                  {ach.title}
                </h4>
                <p className="text-xs text-slate-300 mb-2 font-medium">
                  {ach.description}
                </p>
                <p className="text-[11px] text-amber-300/80 italic font-medium">
                  "{ach.memeHint}"
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800 text-right">
                <span className={`text-[11px] font-bold ${ach.unlocked ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {ach.unlocked ? '✓ Đã mở khóa' : '🔒 Đang khóa'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
