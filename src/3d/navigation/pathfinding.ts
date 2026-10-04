import { NavigationGraph } from './navigationGraph';

// In-memory cache for high-frequency queries
const pathCache = new Map<string, string[] | null>();

/**
 * Clears the pathfinding cache (useful in tests or when graph changes).
 */
export function clearPathCache(): void {
  pathCache.clear();
}

/**
 * Pure A* Pathfinding Algorithm on NavigationGraph.
 * 
 * @param graph The NavigationGraph instance
 * @param startNodeId ID of the starting node
 * @param targetNodeId ID of the goal node
 * @param useCache Whether to check and store result in cache (default: true)
 * @returns Array of node IDs representing the path from start to target, or null if unreachable
 */
export function findPath(
  graph: NavigationGraph,
  startNodeId: string,
  targetNodeId: string,
  useCache = true
): string[] | null {
  // 1. Validate inputs
  const startNode = graph.getNode(startNodeId);
  const targetNode = graph.getNode(targetNodeId);

  if (!startNode || !targetNode) {
    return null;
  }

  // Same node
  if (startNodeId === targetNodeId) {
    return [startNodeId];
  }

  // 2. Cache lookup
  const cacheKey = `${startNodeId}->${targetNodeId}`;
  if (useCache && pathCache.has(cacheKey)) {
    const cached = pathCache.get(cacheKey);
    return cached ? [...cached] : null;
  }

  // 3. A* initialization
  const openSet = new Set<string>([startNodeId]);
  const closedSet = new Set<string>();

  const cameFrom = new Map<string, string>();

  const gScore = new Map<string, number>();
  gScore.set(startNodeId, 0);

  const fScore = new Map<string, number>();
  fScore.set(startNodeId, NavigationGraph.getDistanceXZ(startNode.position, targetNode.position));

  while (openSet.size > 0) {
    // Pick node with lowest fScore from openSet
    let currentId: string | null = null;
    let lowestF = Infinity;

    for (const nodeId of openSet) {
      const f = fScore.get(nodeId) ?? Infinity;
      if (f < lowestF) {
        lowestF = f;
        currentId = nodeId;
      }
    }

    if (!currentId) break;

    // Goal reached
    if (currentId === targetNodeId) {
      const path: string[] = [];
      let curr: string | undefined = currentId;
      while (curr) {
        path.unshift(curr);
        curr = cameFrom.get(curr);
      }

      if (useCache) {
        pathCache.set(cacheKey, [...path]);
      }
      return path;
    }

    openSet.delete(currentId);
    closedSet.add(currentId);

    const currentNode = graph.getNode(currentId);
    if (!currentNode) continue;

    const currentG = gScore.get(currentId) ?? Infinity;

    const neighbors = graph.getNeighbors(currentId);
    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor.id)) {
        continue;
      }

      const stepDist = NavigationGraph.getDistanceXZ(currentNode.position, neighbor.position);
      const tentativeG = currentG + stepDist;

      const neighborG = gScore.get(neighbor.id) ?? Infinity;
      if (tentativeG < neighborG) {
        cameFrom.set(neighbor.id, currentId);
        gScore.set(neighbor.id, tentativeG);
        const h = NavigationGraph.getDistanceXZ(neighbor.position, targetNode.position);
        fScore.set(neighbor.id, tentativeG + h);

        if (!openSet.has(neighbor.id)) {
          openSet.add(neighbor.id);
        }
      }
    }
  }

  // Target is unreachable
  if (useCache) {
    pathCache.set(cacheKey, null);
  }
  return null;
}
