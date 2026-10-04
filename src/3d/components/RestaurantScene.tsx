import React from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { Restaurant3DState, InspectedObject } from '../types/sceneTypes';
import { RestaurantFloor } from './RestaurantFloor';
import { RestaurantWalls } from './RestaurantWalls';
import { RestaurantLighting } from './RestaurantLighting';
import { RestaurantCamera } from './RestaurantCamera';
import { StationRenderer3D } from './stations/StationRenderer3D';
import { Storage3D } from './stations/Storage3D';
import { ServiceCounter3D } from './stations/ServiceCounter3D';
import { DiningArea3D } from './stations/DiningArea3D';
import { InteriorDecor3D } from './stations/InteriorDecor3D';
import { Employee3D } from './characters/Employee3D';
import { Customer3D } from './characters/Customer3D';

interface RestaurantSceneProps {
  sceneState: Restaurant3DState;
  onInspect: (object: InspectedObject) => void;
  controlsRef?: React.RefObject<OrbitControlsImpl | null>;
}

export const RestaurantScene: React.FC<RestaurantSceneProps> = ({
  sceneState,
  onInspect,
  controlsRef,
}) => {
  return (
    <>
      {/* 1. Camera Controls */}
      <RestaurantCamera controlsRef={controlsRef} />

      {/* 2. Restaurant Illumination */}
      <RestaurantLighting />

      {/* 3. Room Shell: Floor & Low Walls */}
      <RestaurantFloor />
      <RestaurantWalls />

      {/* 4. Kitchen Stations (Prep, Fryer, Packing, etc.) */}
      <StationRenderer3D 
        stations={sceneState.stations} 
        onSelectStation={(st) => onInspect({ type: 'station', data: st })}
      />

      {/* 5. Storage Pantry */}
      <Storage3D />

      {/* 6. Service Counter & Pickup Hatch */}
      <ServiceCounter3D 
        readyItems={sceneState.readyItems} 
        onSelectCounterPoint={(point) => onInspect({ type: 'counter_point', data: point })}
      />

      {/* 7. Customer Dining Area */}
      <DiningArea3D 
        onSelectTable={(table) => onInspect({ type: 'table', data: table })}
        onSelectSeat={(seat) => onInspect({ type: 'seat', data: seat })}
      />

      {/* 8. Interior Decor, Amenities & Staff Lounge */}
      <InteriorDecor3D 
        onSelectDecor={(decor) => onInspect({ type: 'decor', data: decor })}
      />

      {/* 8. Staff Employees */}
      {sceneState.employees.map(emp => (
        <Employee3D 
          key={emp.id} 
          employee={emp} 
          onSelect={() => onInspect({ type: 'employee', data: emp })}
        />
      ))}

      {/* 9. Customers */}
      {sceneState.customers.map(cust => (
        <Customer3D 
          key={cust.id} 
          customer={cust} 
          onSelect={() => onInspect({ type: 'customer', data: cust })}
        />
      ))}
    </>
  );
};
