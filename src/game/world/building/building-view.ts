import { TilePos } from '../../helpers/tile-pos';
import Building from './building';
import BuildingSettings from './building-settings';

export default class BuildingView extends Phaser.GameObjects.Sprite {
  private building: Building;

  constructor(scene: Scene, settings: BuildingSettings) {
    super(scene, 0, 0, settings.startingViewKey);
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
