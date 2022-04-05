import BuildingType from '../building/building-type.enum';
import TileType from '../tiles/tile-type.enum';

export default interface ILevelConfig {
  size: ILevelSize;
  tiles: ILevelTilesConfig;
  buildings: ILevelBuildingConfig[];
}

export interface ILevelSize {
  width: number;
  height: number;
}

export interface ILevelTilesConfig {
  fill: ILevelTileFillConfig;
  exceptions: ILevelTileConfig[];
}

export interface ILevelBuildingConfig {
  type: BuildingType;
  x: number;
  y: number;
}

export interface ILevelTileFillConfig {
  type: TileType;
}

export interface ILevelTileConfig {
  type: TileType;
  x: number;
  y: number;
}
