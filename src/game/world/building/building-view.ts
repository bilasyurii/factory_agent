import { TilePos } from '../../helpers/tile-pos';
import Building from './building';
import IBuildingConfig from './building-config.interface';

export default class BuildingView extends Phaser.GameObjects.Sprite {
  private building: Building;

  constructor(scene: Scene, config: IBuildingConfig) {
    super(scene, 0, 0, config.key);
  }

  public setBuilding(tile: Building): void {
    this.building = tile;
  }

  public getBuilding(): Building {
    return this.building;
  }

  public updatePosition(): void {
    const building = this.building;
    this.setPosition(
      TilePos(building.getX()),
      TilePos(building.getY())
    );
  }
}
