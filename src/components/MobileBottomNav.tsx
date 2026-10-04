import React from 'react';
import { TabId } from './Navigation';
import { 
  Home, 
  UtensilsCrossed, 
  Store, 
  Package, 
  Menu 
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onToggleMore: () => void;
  isMoreOpen: boolean;
  pendingQuestsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onToggleMore,
  isMoreOpen,
  pendingQuestsCount,
}) => {
  const isMoreTabActive = ['employees', 'snacktok', 'quests', 'prestige'].includes(activeTab);

  const navItems = [
    { id: 'dashboard' as TabId, label: 'Quán', icon: Home, emoji: '🏠' },
    { id: 'menu' as TabId, label: 'Menu', icon: UtensilsCrossed, emoji: '🍔' },
    { id: 'stores' as TabId, label: 'Lên Đời', icon: Store, emoji: '🏪' },
    { id: 'inventory' as TabId, label: 'Kho Hàng', icon: Package, emoji: '📦' },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/90 lg:hidden flex items-center justify-around px-1"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)' }}
    >
      {navItems.map(item => {
        const isActive = activeTab === item.id && !isMoreOpen;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex-1 min-h-[54px] flex flex-col items-center justify-center py-1.5 transition-all relative select-none active:scale-95 ${
              isActive
                ? 'text-amber-400 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <span className="text-xl leading-none">{item.emoji}</span>
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-sm shadow-amber-400" />
              )}
            </div>
            <span className="text-[11px] font-bold mt-1 tracking-tight">
              {item.label}
            </span>
          </button>
        );
      })}

      {/* 5th Tab: More Drawer */}
      <button
        onClick={onToggleMore}
        className={`flex-1 min-h-[54px] flex flex-col items-center justify-center py-1.5 transition-all relative select-none active:scale-95 ${
          isMoreOpen || isMoreTabActive
            ? 'text-amber-400 font-black'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <span className="text-xl leading-none">☰</span>
          {pendingQuestsCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
              {pendingQuestsCount}
            </span>
          )}
          {(isMoreOpen || isMoreTabActive) && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-sm shadow-amber-400" />
          )}
        </div>
        <span className="text-[11px] font-bold mt-1 tracking-tight">
          {isMoreTabActive ? 'Mở Rộng' : 'Thêm'}
        </span>
      </button>
    </nav>
  );
};
