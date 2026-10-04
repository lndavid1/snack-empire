import React, { useEffect } from 'react';
import { TabId } from './Navigation';
import { useGameStore } from '../store/gameStore';
import { 
  Users, 
  Share2, 
  Trophy, 
  Sparkles, 
  Settings, 
  Volume2, 
  VolumeX, 
  Save, 
  X, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface MobileMoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onOpenSettings: () => void;
  pendingQuestsCount: number;
}

export const MobileMoreMenu: React.FC<MobileMoreMenuProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onOpenSettings,
  pendingQuestsCount,
}) => {
  const { soundEnabled, toggleSound, saveGame, addFloatingText } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTabClick = (tab: TabId) => {
    onSelectTab(tab);
    onClose();
  };

  const handleQuickSave = () => {
    saveGame();
    addFloatingText('💾 Đã lưu tiến trình!', window.innerWidth / 2, window.innerHeight / 2, 'text-emerald-400');
    onClose();
  };

  const menuItems = [
    {
      id: 'employees' as TabId,
      label: 'Nhân Sự & Tuyển Dụng',
      desc: 'Quản lý đầu bếp, thu ngân, tự động hóa',
      icon: Users,
      emoji: '👨‍🍳',
      badge: null,
    },
    {
      id: 'snacktok' as TabId,
      label: 'SnackTok & Marketing',
      desc: 'Viral meme, quảng cáo, đối thủ cạnh tranh',
      icon: Share2,
      emoji: '📱',
      badge: null,
    },
    {
      id: 'quests' as TabId,
      label: 'Nhiệm Vụ & Thành Tựu',
      desc: 'Nhiệm vụ doanh nghiệp & Meme Gen Z',
      icon: Trophy,
      emoji: '🏆',
      badge: pendingQuestsCount > 0 ? `${pendingQuestsCount} quà` : null,
    },
    {
      id: 'prestige' as TabId,
      label: 'Tái Sinh & Nghiên Cứu',
      desc: 'Nhận Empire Points & bổ trợ vĩnh viễn',
      icon: Sparkles,
      emoji: '🚀',
      badge: 'Prestige',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Bottom Sheet Modal */}
      <div 
        className="relative z-10 w-full max-h-[88dvh] bg-slate-900 border-t border-slate-800 rounded-t-3xl shadow-2xl flex flex-col animate-slide-up overflow-hidden"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}
      >
        {/* Drag handle & Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">☰</span>
            <h3 className="text-base font-extrabold text-slate-100">
              Menu Mở Rộng
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors active:scale-95"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable menu content */}
        <div className="overflow-y-auto p-4 space-y-2 no-scrollbar flex-1">
          {/* Main secondary tabs */}
          {menuItems.map(item => {
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full min-h-[52px] p-3 rounded-2xl flex items-center justify-between text-left transition-all active:scale-98 ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-slate-800/60 text-slate-200 border border-slate-700/50 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-slate-800 rounded-xl border border-slate-700">
                    {item.emoji}
                  </span>
                  <div>
                    <div className="font-bold text-sm leading-tight flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500 text-white">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 leading-tight mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              </button>
            );
          })}

          <div className="pt-2 pb-1 border-t border-slate-800/80 my-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
              Tiện ích hệ thống
            </span>
          </div>

          {/* System action buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                toggleSound();
              }}
              className="min-h-[50px] p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-center flex flex-col items-center justify-center gap-1 active:scale-95 transition-all"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-amber-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              <span className="text-[11px] font-bold text-slate-300">
                {soundEnabled ? 'Âm thanh: BẬT' : 'Âm thanh: TẮT'}
              </span>
            </button>

            <button
              onClick={handleQuickSave}
              className="min-h-[50px] p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-center flex flex-col items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <Save className="w-5 h-5 text-emerald-400" />
              <span className="text-[11px] font-bold text-slate-300">
                Lưu Tiến Trình
              </span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="min-h-[50px] p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-center flex flex-col items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <Settings className="w-5 h-5 text-sky-400" />
              <span className="text-[11px] font-bold text-slate-300">
                Cài Đặt
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
