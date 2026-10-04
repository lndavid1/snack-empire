import { NAVIGATION_NODES } from '../config/restaurantLayout';
import type { NavigationNode, RestaurantZoneType, Vector3Tuple } from '../types/sceneTypes';

export class NavigationGraph {
  private nodesMap: Map<string, NavigationNode>;
  private nodesList: NavigationNode[];

  constructor(nodes: NavigationNode[] = NAVIGATION_NODES) {
    this.nodesList = [...nodes];
    this.nodesMap = new Map();
    for (const node of nodes) {
      this.nodesMap.set(node.id, node);
    }
  }

  public getNode(id: string): NavigationNode | undefined {
    return this.nodesMap.get(id);
  }

  public getAllNodes(): NavigationNode[] {
    return this.nodesList;
  }

  public getNeighbors(nodeId: string): NavigationNode[] {
    const node = this.nodesMap.get(nodeId);
    if (!node) return [];

    const neighbors: NavigationNode[] = [];
    for (const connId of node.connections) {
      const neighbor = this.nodesMap.get(connId);
      if (neighbor) {
        neighbors.push(neighbor);
      }
    }
    return neighbors;
  }

  /**
   * Euclidean distance in the horizontal XZ plane (height Y is largely ground level).
   */
  public static getDistanceXZ(posA: Vector3Tuple, posB: Vector3Tuple): number {
    const dx = posA[0] - posB[0];
    const dz = posA[2] - posB[2];
    return Math.sqrt(dx * dx + dz * dz);
  }

  /**
   * 3D Euclidean distance.
   */
  public static getDistance3D(posA: Vector3Tuple, posB: Vector3Tuple): number {
    const dx = posA[0] - posB[0];
    const dy = posA[1] - posB[1];
    const dz = posA[2] - posB[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Finds the closest node to a given 3D position.
   * Can optionally filter by RestaurantZoneType.
   */
  public findNearestNode(
    position: Vector3Tuple,
    zoneFilter?: RestaurantZoneType | RestaurantZoneType[]
  ): NavigationNode | null {
    if (this.nodesList.length === 0) return null;

    let nearestNode: NavigationNode | null = null;
    let minDistance = Infinity;

    const allowedZones = Array.isArray(zoneFilter)
      ? new Set(zoneFilter)
      : zoneFilter
      ? new Set([zoneFilter])
      : null;

    for (const node of this.nodesList) {
      if (allowedZones && !allowedZones.has(node.zone)) {
        continue;
      }

      const dist = NavigationGraph.getDistanceXZ(position, node.position);
      if (dist < minDistance) {
        minDistance = dist;
        nearestNode = node;
      }
    }

    // Fallback: if zone filter didn't match any node, find absolute nearest
    if (!nearestNode && allowedZones) {
      return this.findNearestNode(position);
    }

    return nearestNode;
  }

  /**
   * Validates that all connection IDs in the graph reference existing nodes.
   */
  public validateGraph(): { isValid: boolean; brokenLinks: Array<{ from: string; to: string }> } {
    const brokenLinks: Array<{ from: string; to: string }> = [];

    for (const node of this.nodesList) {
      for (const connId of node.connections) {
        if (!this.nodesMap.has(connId)) {
          brokenLinks.push({ from: node.id, to: connId });
        }
      }
    }

    return {
      isValid: brokenLinks.length === 0,
      brokenLinks,
    };
  }
}

// Singleton instance built from default layout configuration
export const defaultNavigationGraph = new NavigationGraph();
