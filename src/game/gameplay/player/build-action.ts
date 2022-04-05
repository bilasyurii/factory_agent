import BuildingType from '../../world/building/building-type.enum';
import TileType from '../../world/tiles/tile-type.enum';
import PlayerAction from './player-action';
import PlayerActionType from './player-action-type.enum';

export default class BuildAction extends PlayerAction {
  protected buildingType: BuildingType;
  protected x: number;
  protected y: number;

  constructor(buildingType: BuildingType, x: number, y: number) {
    super(PlayerActionType.Build);

    this.buildingType = buildingType;
    this.x = x;
    this.y = y;
  }

  public getBuildingType(): BuildingType {
    return this.buildingType;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public execute(): void {
    const grid = this.grid;
    const tile = grid.getTile(this.x, this.y);
    const building = this.buildingFactory.create(this.buildingType);

    if (tile.getType() !== TileType.Platform) {
      this.tileFactory.setupTile(tile, TileType.Platform);
    }

    tile.setBuilding(building);
    grid.addBuilding(building);
  }
}
