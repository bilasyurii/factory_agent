import ArrayUtils from '../../../../utils/array-utils';
import ObjectUtils from '../../../../utils/object-utils';
import Building from '../../building/building';
import BuildingType from '../../building/building-type.enum';
import { areRelative } from '../../building/buildings-relativity';
import Tile from '../../tiles/tile';
import Grid from '../grid';
import PathfinderEventType from './pathfinder-event-type.enum';
import IPathsAnalytics from './paths-analytics.interface';

type ConnectionsData = Record<string, number>;
type PathsData = Record<string, ConnectionsData>;

export default class Pathfinder extends Phaser.Events.EventEmitter {
  private grid: Grid;
  private dirty: boolean = true;
  private distances: number[][];
  private neighborOffsets: Vector2[];
  private paths: PathsData;
  private prevPaths: PathsData;

  constructor(grid: Grid) {
    super();

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

  public getPreviousPathsData(): PathsData {
    return this.prevPaths;
  }

  public getPaths(): PathsData {
    return this.paths;
  }

  public analyzePathsData(data: PathsData): IPathsAnalytics {
    let missingPathsCount = 0;
    const buildingsCount = Object.keys(data).length;

    ObjectUtils.forInObject<string, ConnectionsData>(data, function (_, connections) {
      const connectionsCount = Object.keys(connections).length;
      missingPathsCount += (buildingsCount - connectionsCount);
    });

    return {
      missingPathsCount,
    };
  }

  public update(silent: boolean = false): void {
    this.prevPaths = this.paths;

    if (!this.dirty) {
      return;
    }

    this.paths = {};
    this.grid.forEachBuilding(this.processBuildingConnections, this);
    this.dirty = false;

    if (!silent) {
      this.emitConnectionEvents();
    }
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

    const connections: ConnectionsData = {};
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

  private emitConnectionEvents(): void {
    const prevPaths = this.prevPaths;

    if (!prevPaths) {
      return;
    }

    const self = this;
    const paths = this.paths;
    const grid = this.grid;
    let connectedBuildings = 0;
    let connectedRelatedBuildings = 0;
    let connectedToStorage = 0;

    ObjectUtils.forInObject<string, ConnectionsData>(paths, function (buildingId, connections) {
      const prevConnections = prevPaths[buildingId] || {};
      const building = grid.getBuildingById(parseInt(buildingId));

      if (!building) {
        return;
      }

      const buildingType = building.getType();

      ObjectUtils.forInObject<string, number>(connections, function (otherBuildingId) {
        if (prevConnections[otherBuildingId] === undefined) {
          ++connectedBuildings;

          const otherBuilding = grid.getBuildingById(parseInt(otherBuildingId));
          const otherBuildingType = otherBuilding.getType();

          if (areRelative(buildingType, otherBuildingType)) {
            ++connectedRelatedBuildings;
          }

          if (otherBuildingType === BuildingType.Storage) {
            ++connectedToStorage;
          }
        }
      });
    });

    if (connectedBuildings) {
      connectedBuildings *= 0.5;

      for (let i = 0; i < connectedBuildings; ++i) {
        self.emit(PathfinderEventType.ConnectedBuildings);
      }

      if (connectedRelatedBuildings) {
        connectedRelatedBuildings *= 0.5;

        for (let i = 0; i < connectedRelatedBuildings; ++i) {
          self.emit(PathfinderEventType.ConnectedRelatedBuildings);
        }
      }

      if (connectedToStorage) {
        for (let i = 0; i < connectedToStorage; ++i) {
          self.emit(PathfinderEventType.ConnectedBuildingToStorage);
        }
      }
    }
  }
}
