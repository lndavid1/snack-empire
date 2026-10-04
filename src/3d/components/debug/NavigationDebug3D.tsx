import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { NAVIGATION_NODES } from '../../config/restaurantLayout';
import type { Vector3Tuple } from '../../types/sceneTypes';

interface NavigationDebug3DProps {
  enabled: boolean;
  activePaths?: Array<{
    id: string;
    waypoints: Vector3Tuple[];
    color?: string;
  }>;
}

export const NavigationDebug3D: React.FC<NavigationDebug3DProps> = ({ 
  enabled,
  activePaths = []
}) => {
  // Memoize graph connection line segments
  const connectionLines = useMemo(() => {
    if (!enabled) return [];

    const nodesMap = new Map(NAVIGATION_NODES.map(n => [n.id, n]));
    const drawnPairs = new Set<string>();
    const lines: Array<{ from: Vector3Tuple; to: Vector3Tuple; key: string }> = [];

    for (const node of NAVIGATION_NODES) {
      for (const connId of node.connections) {
        const neighbor = nodesMap.get(connId);
        if (!neighbor) continue;

        const pairKey = [node.id, connId].sort().join('--');
        if (drawnPairs.has(pairKey)) continue;
        drawnPairs.add(pairKey);

        lines.push({
          from: [node.position[0], 0.08, node.position[2]],
          to: [neighbor.position[0], 0.08, neighbor.position[2]],
          key: pairKey,
        });
      }
    }
    return lines;
  }, [enabled]);

  if (!enabled) return null;

  return (
    <group>
      {/* 1. Graph Waypoint Markers */}
      {NAVIGATION_NODES.map(node => (
        <group key={node.id} position={[node.position[0], 0.12, node.position[2]]}>
          {/* Waypoint glowing circle ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.18, 0.24, 16]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>

          {/* Node ID Label */}
          <Html position={[0, 0.4, 0]} center distanceFactor={16} zIndexRange={[50, 0]}>
            <div className="px-1.5 py-0.5 rounded bg-slate-900/90 text-[9px] font-mono font-bold text-sky-300 border border-sky-500/40 select-none pointer-events-none whitespace-nowrap">
              {node.id}
            </div>
          </Html>
        </group>
      ))}

      {/* 2. Connection Edges */}
      {connectionLines.map(line => {
        const midX = (line.from[0] + line.to[0]) / 2;
        const midZ = (line.from[2] + line.to[2]) / 2;
        const dx = line.to[0] - line.from[0];
        const dz = line.to[2] - line.from[2];
        const length = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dx, dz);

        return (
          <mesh 
            key={line.key} 
            position={[midX, 0.06, midZ]} 
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.04, 0.01, length]} />
            <meshBasicMaterial color="#0284c7" transparent opacity={0.4} />
          </mesh>
        );
      })}

      {/* 3. Active Character Paths */}
      {activePaths.map(path => {
        if (path.waypoints.length < 2) return null;
        return (
          <group key={path.id}>
            {path.waypoints.slice(0, -1).map((wp, i) => {
              const next = path.waypoints[i + 1];
              const midX = (wp[0] + next[0]) / 2;
              const midZ = (wp[2] + next[2]) / 2;
              const dx = next[0] - wp[0];
              const dz = next[2] - wp[2];
              const len = Math.sqrt(dx * dx + dz * dz);
              const angle = Math.atan2(dx, dz);

              return (
                <mesh
                  key={i}
                  position={[midX, 0.1, midZ]}
                  rotation={[0, angle, 0]}
                >
                  <boxGeometry args={[0.08, 0.02, len]} />
                  <meshBasicMaterial color={path.color || '#f59e0b'} transparent opacity={0.7} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
};
