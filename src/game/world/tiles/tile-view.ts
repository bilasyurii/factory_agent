import { TilePos } from '../../helpers/tile-pos';
import Tile from './tile';
import ITileSettings from './tile-settings.interface';

export default class TileView extends Phaser.GameObjects.Sprite {
  private tile: Tile;

  constructor(scene: Scene, config: ITileSettings) {
    super(scene, 0, 0, config.key);
  }

  public setTile(tile: Tile): void {
    this.tile = tile;
  }

  public getTile(): Tile {
    return this.tile;
  }

  public updatePosition(): void {
    const tile = this.tile;

    if (tile) {
      this.setPosition(
        TilePos(tile.getX()),
        TilePos(tile.getY())
      );
    }
  }
}
