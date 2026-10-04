import React from 'react';
import type { Station3DState, InspectedObject } from '../../types/sceneTypes';
import { PrepTable3D } from './PrepTable3D';
import { Fryer3D } from './Fryer3D';
import { PackingStation3D } from './PackingStation3D';

interface StationRenderer3DProps {
  stations: Station3DState[];
  onSelectStation?: (station: Station3DState) => void;
}

export const StationRenderer3D: React.FC<StationRenderer3DProps> = ({
  stations,
  onSelectStation,
}) => {
  return (
    <group>
      {stations.map(station => {
        const handleSelect = () => onSelectStation?.(station);

        switch (station.stationType) {
          case 'prep':
            return <PrepTable3D key={station.id} station={station} onSelect={handleSelect} />;
          case 'fryer':
            return <Fryer3D key={station.id} station={station} onSelect={handleSelect} />;
          case 'packing':
            return <PackingStation3D key={station.id} station={station} onSelect={handleSelect} />;
          default:
            // Fallback for generic kitchen stations (grill, oven, assembly, etc.)
            return <PrepTable3D key={station.id} station={station} onSelect={handleSelect} />;
        }
      })}
    </group>
  );
};
