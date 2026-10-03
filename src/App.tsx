import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { Header } from './components/Header';
import { Navigation, TabId } from './components/Navigation';
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

export function App() {
  const { initGame, tickSimulation, quests } = useGameStore();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row p-3 md:p-6 gap-6">
        {/* Navigation Sidebar */}
        <Navigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingQuestsCount={pendingQuestsCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'menu' && <MenuKitchenView />}
          {activeTab === 'inventory' && <InventorySuppliersView />}
          {activeTab === 'stores' && <StoresExpansionView />}
          {activeTab === 'employees' && <EmployeesView />}
          {activeTab === 'snacktok' && <SnackTokMarketingView />}
          {activeTab === 'quests' && <QuestsAchievementsView />}
          {activeTab === 'prestige' && <PrestigeResearchView />}
        </main>
      </div>

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
