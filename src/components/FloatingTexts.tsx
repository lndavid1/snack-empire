import React from 'react';
import { useGameStore } from '../store/gameStore';

export const FloatingTexts: React.FC = () => {
  const floatingTexts = useGameStore(state => state.floatingTexts);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {floatingTexts.map(f => (
        <div
          key={f.id}
          className={`absolute font-black tracking-wide drop-shadow-md select-none animate-float-fade ${f.color}`}
          style={{
            left: `${f.x}px`,
            top: `${f.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {f.text}
        </div>
      ))}
    </div>
  );
};
