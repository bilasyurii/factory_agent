import { TilePos } from '../../helpers/tile-pos';
import Tile from './tile';
import ITileConfig from './tile-config.interface';

export default class TileView extends Phaser.GameObjects.Sprite {
  private tile: Tile;

  constructor(scene: Scene, config: ITileConfig) {
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
    this.setPosition(
      TilePos(tile.getX()),
      TilePos(tile.getY())
    );
  }
}
