import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useGameStore } from './store/gameStore';
import { Header } from './components/Header';
import { Navigation, TabId } from './components/Navigation';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileMoreMenu } from './components/MobileMoreMenu';
import { TutorialBanner } from './components/TutorialBanner';
import { FloatingTexts } from './components/FloatingTexts';
import { EventModal } from './components/EventModal';
import { OfflineModal } from './components/OfflineModal';
import { SettingsModal } from './components/SettingsModal';

import { DashboardView } from './components/views/DashboardView';
import { MenuKitchenView } from './components/views/MenuKitchenView';
import { InventorySuppliersView } from './components/views/InventorySuppliersView';
import { StoresExpansionView } from './components/views/StoresExpansionView';
import { EmployeesView } from './components/views/EmployeesView';
import { SnackTokMarketingView } from './components/views/SnackTokMarketingView';
import { QuestsAchievementsView } from './components/views/QuestsAchievementsView';
import { PrestigeResearchView } from './components/views/PrestigeResearchView';

const Restaurant3DView = lazy(() => 
  import('./3d/Restaurant3DView').then(m => ({ default: m.Restaurant3DView }))
);

export function App() {
  const { initGame, tickSimulation, quests } = useGameStore();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Initialize game & offline check
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Centralized Simulation Tick Loop (1 second per tick)
  useEffect(() => {
    const interval = setInterval(() => {
      tickSimulation();
    }, 1000);

    return () => clearInterval(interval);
  }, [tickSimulation]);

  const pendingQuestsCount = quests.filter(q => q.completed && !q.claimed).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header Bar */}
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Tutorial Banner for first-time players */}
      <TutorialBanner />

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row p-3 md:p-6 gap-4 lg:gap-6 pb-24 lg:pb-6">
        {/* Desktop Sidebar (Hidden on mobile) */}
        <Navigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingQuestsCount={pendingQuestsCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && <DashboardView onOpen3D={() => setActiveTab('restaurant3d')} />}
          {activeTab === 'restaurant3d' && (
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-950 rounded-3xl border border-slate-800 text-slate-400 gap-3">
                <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold">Đang tải không gian 3D...</span>
              </div>
            }>
              <Restaurant3DView onBackTo2D={() => setActiveTab('dashboard')} />
            </Suspense>
          )}
          {activeTab === 'menu' && <MenuKitchenView />}
          {activeTab === 'inventory' && <InventorySuppliersView />}
          {activeTab === 'stores' && <StoresExpansionView />}
          {activeTab === 'employees' && <EmployeesView />}
          {activeTab === 'snacktok' && <SnackTokMarketingView />}
          {activeTab === 'quests' && <QuestsAchievementsView />}
          {activeTab === 'prestige' && <PrestigeResearchView />}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation (Hidden on desktop) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isMoreOpen={isMoreMenuOpen}
        onToggleMore={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
        pendingQuestsCount={pendingQuestsCount}
      />

      {/* Mobile More Drawer / Bottom Sheet */}
      <MobileMoreMenu
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        pendingQuestsCount={pendingQuestsCount}
      />

      {/* Overlays, Floating Texts & Modals */}
      <FloatingTexts />
      <EventModal />
      <OfflineModal />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
