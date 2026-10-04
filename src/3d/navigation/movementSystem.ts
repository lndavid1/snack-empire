import type { Vector3Tuple } from '../types/sceneTypes';
import { defaultNavigationGraph, NavigationGraph } from './navigationGraph';
import { buildNavigationPath } from './navigationService';
import { 
  MOVEMENT_CONFIG, 
  type MovementStatus, 
  type MovementState 
} from './navigationTypes';

export class CharacterMovementController {
  public position: Vector3Tuple;
  public rotation: number; // Y-axis rotation in radians
  public targetPosition?: Vector3Tuple;
  public waypoints: Vector3Tuple[];
  public currentWaypointIndex: number;
  public speed: number;
  public status: MovementStatus;
  public nodePath: string[];

  constructor(
    initialPosition: Vector3Tuple,
    initialRotation = 0,
    speed: number = MOVEMENT_CONFIG.EMPLOYEE_WALK_SPEED
  ) {
    this.position = [...initialPosition];
    this.rotation = initialRotation;
    this.waypoints = [];
    this.currentWaypointIndex = 0;
    this.speed = speed;
    this.status = 'IDLE';
    this.nodePath = [];
  }

  /**
   * Sets a new navigation target destination.
   * Calculates waypoints via the Navigation Graph if needed.
   */
  public setDestination(
    newTarget: Vector3Tuple,
    graph: NavigationGraph = defaultNavigationGraph
  ): void {
    const dist = NavigationGraph.getDistanceXZ(this.position, newTarget);

    // If already at target, no movement needed
    if (dist <= MOVEMENT_CONFIG.ARRIVAL_THRESHOLD) {
      this.targetPosition = [...newTarget];
      this.waypoints = [];
      this.currentWaypointIndex = 0;
      this.status = 'ARRIVED';
      return;
    }

    // Build waypoint route using graph + A*
    const result = buildNavigationPath(this.position, newTarget, graph);

    this.targetPosition = [...newTarget];
    this.waypoints = result.waypoints;
    this.currentWaypointIndex = 0;
    this.nodePath = result.nodeIds;
    this.status = result.waypoints.length > 0 ? 'MOVING' : 'FAILED';
  }

  /**
   * Updates character movement along the waypoint trail for a delta time step.
   * Can accept dynamic neighbor positions for lightweight character separation.
   */
  public update(
    delta: number,
    otherPositions: Vector3Tuple[] = []
  ): {
    position: Vector3Tuple;
    rotation: number;
    status: MovementStatus;
    isWalking: boolean;
  } {
    if (this.status !== 'MOVING' || this.waypoints.length === 0) {
      return {
        position: this.position,
        rotation: this.rotation,
        status: this.status,
        isWalking: false,
      };
    }

    // Current waypoint target
    const currentWP = this.waypoints[this.currentWaypointIndex];
    if (!currentWP) {
      this.status = 'ARRIVED';
      return {
        position: this.position,
        rotation: this.rotation,
        status: this.status,
        isWalking: false,
      };
    }

    let dx = currentWP[0] - this.position[0];
    let dz = currentWP[2] - this.position[2];
    let distToWP = Math.sqrt(dx * dx + dz * dz);

    // Check if reached current waypoint
    if (distToWP <= MOVEMENT_CONFIG.ARRIVAL_THRESHOLD) {
      this.currentWaypointIndex++;

      // Check if reached final waypoint
      if (this.currentWaypointIndex >= this.waypoints.length) {
        if (this.targetPosition) {
          this.position[0] = this.targetPosition[0];
          this.position[2] = this.targetPosition[2];
        }
        this.status = 'ARRIVED';
        return {
          position: this.position,
          rotation: this.rotation,
          status: this.status,
          isWalking: false,
        };
      }

      // Re-evaluate next waypoint
      const nextWP = this.waypoints[this.currentWaypointIndex];
      dx = nextWP[0] - this.position[0];
      dz = nextWP[2] - this.position[2];
      distToWP = Math.sqrt(dx * dx + dz * dz);
    }

    // Lightweight separation: check distance to other characters
    let speedModifier = 1.0;
    for (const otherPos of otherPositions) {
      const sepDist = NavigationGraph.getDistanceXZ(this.position, otherPos);
      if (sepDist > 0.05 && sepDist < MOVEMENT_CONFIG.SEPARATION_DISTANCE) {
        // Slow down slightly to avoid harsh collisions
        speedModifier = 0.7;
        break;
      }
    }

    const effectiveSpeed = this.speed * speedModifier;

    // Normalize direction and rotate toward target
    if (distToWP > 0.001) {
      const nx = dx / distToWP;
      const nz = dz / distToWP;

      // Target rotation angle (yaw) in Three.js coordinates
      const targetAngle = Math.atan2(nx, nz);

      // Smooth shortest-path angle interpolation
      let angleDiff = targetAngle - this.rotation;
      while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      const maxRotStep = MOVEMENT_CONFIG.ROTATION_SPEED * delta;
      this.rotation += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), maxRotStep);

      // Linear motion step
      const step = Math.min(distToWP, effectiveSpeed * delta);
      this.position[0] += nx * step;
      this.position[2] += nz * step;
    }

    return {
      position: this.position,
      rotation: this.rotation,
      status: this.status,
      isWalking: true,
    };
  }

  public getMovementState(): MovementState {
    return {
      position: [...this.position],
      rotation: this.rotation,
      targetPosition: this.targetPosition ? [...this.targetPosition] : undefined,
      path: this.waypoints.map(w => [...w]),
      currentPathIndex: this.currentWaypointIndex,
      speed: this.speed,
      status: this.status,
      nodePath: [...this.nodePath],
    };
  }
}
