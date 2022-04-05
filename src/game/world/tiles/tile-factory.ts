import Tile from './tile';
import ITileSettings from './tile-settings.interface';
import TileType from './tile-type.enum';
import TileView from './tile-view';

export default class TileFactory {
  private scene: Scene;
  private settingsLookup: Record<TileType, ITileSettings> = <any>{};

  constructor(scene: Scene) {
    this.scene = scene;

    this.setupSettings();
  }

  public create(type: TileType): Tile {
    const tile = new Tile();
    this.setupTile(tile, type);
    return tile;
  }

  public setupTile(tile: Tile, type: TileType): void {
    const settings = this.settingsLookup[type];
    tile.setType(type);
    tile.setView(new TileView(this.scene, settings));
  }

  private setupSettings(): void {
    const settings = [
      {
        key: 'platform',
        type: TileType.Platform,
      },
      {
        key: 'grass',
        type: TileType.Grass,
      },
      {
        key: 'water',
        type: TileType.Water,
      },
      {
        key: 'sand',
        type: TileType.Sand,
      },
    ];

    settings.forEach((setting) => this.addSetting(setting));
  }

  private addSetting(setting: ITileSettings): void {
    this.settingsLookup[setting.type] = setting;
  }
}
