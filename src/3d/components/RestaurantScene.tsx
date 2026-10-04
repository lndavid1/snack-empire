import React from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { Restaurant3DState, InspectedObject, Vector3Tuple } from '../types/sceneTypes';
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
import { NavigationDebug3D } from './debug/NavigationDebug3D';
import { useGameStore } from '../../store/gameStore';

interface RestaurantSceneProps {
  sceneState: Restaurant3DState;
  onInspect: (object: InspectedObject) => void;
  controlsRef?: React.RefObject<OrbitControlsImpl | null>;
  showDebugNav?: boolean;
}

export const RestaurantScene: React.FC<RestaurantSceneProps> = ({
  sceneState,
  onInspect,
  controlsRef,
  showDebugNav = false,
}) => {
  const [activePaths, setActivePaths] = React.useState<Map<string, { id: string; waypoints: Vector3Tuple[]; color?: string }>>(new Map());
  const tableStates = useGameStore(s => s.tableStates);
  const cleanTable = useGameStore(s => s.cleanTable);

  const handleMovementUpdate = React.useCallback((id: string, waypoints: Vector3Tuple[]) => {
    setActivePaths(prev => {
      const next = new Map(prev);
      if (waypoints.length > 1) {
        next.set(id, { id, waypoints, color: id.startsWith('emp') ? '#f59e0b' : '#38bdf8' });
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);
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
        customers={sceneState.customers}
        tableStates={tableStates}
        onCleanTable={cleanTable}
        onSelectTable={(table) => onInspect({ type: 'table', data: table })}
        onSelectSeat={(seat) => onInspect({ type: 'seat', data: seat })}
      />

      {/* 8. Interior Decor, Amenities & Staff Lounge */}
      <InteriorDecor3D 
        onSelectDecor={(decor) => onInspect({ type: 'decor', data: decor })}
      />

      {/* 9. Staff Employees */}
      {sceneState.employees.map(emp => {
        const otherPositions = [
          ...sceneState.employees.filter(e => e.id !== emp.id).map(e => e.targetPosition),
          ...sceneState.customers.map(c => c.targetPosition),
        ];

        const activeJob = sceneState.stations.find(s => 
          s.assignedEmployeeId === emp.id || 
          s.id === emp.assignedStationId ||
          (emp.currentJobId && s.activeJob?.id === emp.currentJobId)
        )?.activeJob;

        return (
          <Employee3D 
            key={emp.id} 
            employee={emp} 
            activeJob={activeJob}
            onSelect={() => onInspect({ type: 'employee', data: emp })}
            otherPositions={otherPositions}
            onMovementUpdate={handleMovementUpdate}
          />
        );
      })}

      {/* 10. Customers */}
      {sceneState.customers.map(cust => {
        const otherPositions = [
          ...sceneState.customers.filter(c => c.id !== cust.id).map(c => c.targetPosition),
          ...sceneState.employees.map(e => e.targetPosition),
        ];

        return (
          <Customer3D 
            key={cust.id} 
            customer={cust} 
            onSelect={() => onInspect({ type: 'customer', data: cust })}
            otherPositions={otherPositions}
            onMovementUpdate={handleMovementUpdate}
          />
        );
      })}

      {/* 11. Optional Developer Navigation Debugger */}
      <NavigationDebug3D 
        enabled={showDebugNav} 
        activePaths={Array.from(activePaths.values())} 
      />
    </>
  );
};
