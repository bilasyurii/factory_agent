import ArrayUtils from '../../../../utils/array-utils';
import ObjectUtils from '../../../../utils/object-utils';
import Building, { BuildingId } from '../../building/building';
import BuildingType from '../../building/building-type.enum';
import Tile from '../../tiles/tile';
import Grid from '../grid';

export default class Pathfinder {
  private grid: Grid;
  private dirty: boolean = true;
  private distances: number[][];
  private neighborOffsets: Vector2[];
  private paths: Record<BuildingId, Record<BuildingId, number>>;

  constructor(grid: Grid) {
    this.grid = grid;

    this.initArrays();
  }

  public markDirty(): void {
    this.dirty = true;
  }

  public getPathLength(from: Building, to: Building): number {
    const pathsFrom = this.paths[from.id];

    if (pathsFrom) {
      const pathLength = pathsFrom[to.id];
      return pathLength === undefined ? Infinity : pathLength;
    }

    return Infinity;
  }

  public getClosestByType(from: Building, toType: BuildingType): Building {
    const grid = this.grid;
    let closestDistance: number = Infinity;
    let closestBuilding: Building = null;

    ObjectUtils.forInObject<string, number>(this.paths[from.id], function (id, distance) {
      const building = grid.getBuildingById(parseInt(id));

      if (building.getType() !== toType) {
        return;
      }

      if (distance < closestDistance) {
        closestDistance = distance;
        closestBuilding = building;
      }
    });

    return closestBuilding;
  }

  public update(): void {
    if (!this.dirty) {
      return;
    }

    this.paths = {};
    this.grid.forEachBuilding(this.processBuildingConnections, this);
    this.dirty = false;
  }

  private initArrays(): void {
    const grid = this.grid;
    const width = grid.getWidth();
    const height = grid.getHeight();

    this.distances = ArrayUtils.initArray(width, height, Infinity);
    this.neighborOffsets = [
      Phaser.Math.Vector2.UP,
      Phaser.Math.Vector2.RIGHT,
      Phaser.Math.Vector2.DOWN,
      Phaser.Math.Vector2.LEFT,
    ];
  }

  private processBuildingConnections(building: Building): void {
    if (building.getType() === BuildingType.Conveyor) {
      return;
    }

    const connections: Record<BuildingId, number> = {};
    this.paths[building.id] = connections;

    const grid = this.grid;
    const neighborOffsets = this.neighborOffsets;
    const neighborsCount = neighborOffsets.length;
    const startTile = building.getTile();

    const distances = this.distances;
    const UNDISCOVERED = -1;
    ArrayUtils.fillArray2d(distances, UNDISCOVERED);
    distances[startTile.getY()][startTile.getX()] = 0;

    const queue: Tile[] = [];
    queue.push(startTile);

    while (queue.length !== 0) {
      const tile = queue.shift();
      const x = tile.getX();
      const y = tile.getY();
      const distance = distances[y][x];

      for (let i = 0; i < neighborsCount; ++i) {
        const offset = neighborOffsets[i];
        const neighborX = x + offset.x;
        const neighborY = y + offset.y;
        const neighbor = grid.getTile(neighborX, neighborY);

        if (!neighbor || distances[neighborY][neighborX] !== UNDISCOVERED) {
          continue;
        }

        const otherBuilding = neighbor.getBuilding();

        if (!otherBuilding) {
          distances[neighborY][neighborX] = Infinity;
          continue;
        }

        queue.push(neighbor);

        const newDistance = distance + 1;
        distances[neighborY][neighborX] = newDistance;

        if (otherBuilding.getType() !== BuildingType.Conveyor) {
          connections[otherBuilding.id] = newDistance;
        }
      }
    }
  }
}
