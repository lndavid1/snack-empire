import React from 'react';
import { 
  Home, 
  UtensilsCrossed, 
  Package, 
  Store, 
  Users, 
  Share2, 
  Trophy, 
  Sparkles 
} from 'lucide-react';

export type TabId = 
  | 'dashboard' 
  | 'menu' 
  | 'inventory' 
  | 'stores' 
  | 'employees' 
  | 'snacktok' 
  | 'quests' 
  | 'prestige';

interface NavigationProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  pendingQuestsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onSelectTab,
  pendingQuestsCount
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Quán Ẩm Thực', icon: Home, emoji: '🏠' },
    { id: 'menu', label: 'Menu Món Ăn', icon: UtensilsCrossed, emoji: '🍔' },
    { id: 'inventory', label: 'Kho Nguyên Liệu', icon: Package, emoji: '📦' },
    { id: 'stores', label: 'Nâng Cấp Quán', icon: Store, emoji: '🏪' },
    { id: 'employees', label: 'Nhân Sự', icon: Users, emoji: '👨‍🍳' },
    { id: 'snacktok', label: 'SnackTok & Mkt', icon: Share2, emoji: '📱' },
    { id: 'quests', label: 'Nhiệm Vụ', icon: Trophy, emoji: '🏆', badge: pendingQuestsCount },
    { id: 'prestige', label: 'Tái Sinh', icon: Sparkles, emoji: '🚀' },
  ];

  return (
    <nav className="w-full bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 flex lg:flex-col overflow-x-auto lg:overflow-y-auto no-scrollbar shrink-0 lg:w-64">
      <div className="flex lg:flex-col p-2 gap-1.5 w-full">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id as TabId)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap relative text-left ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <span className="text-base">{tab.emoji}</span>
              <span className="hidden sm:inline lg:inline font-bold">{tab.label}</span>
              <span className="sm:hidden lg:hidden">{tab.label.split(' ')[0]}</span>

              {tab.badge && tab.badge > 0 ? (
                <span className="ml-auto bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-bounce">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
