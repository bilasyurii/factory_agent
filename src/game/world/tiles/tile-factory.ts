import Tile from "./tile";
import ITileSettings from "./tile-settings.interface";
import TileType from "./tile-type.enum";
import TileView from "./tile-view";

export default class TileFactory {
  private scene: Scene;
  private settingsLookup: Record<TileType, ITileSettings> = <any>{};

  constructor(scene: Scene) {
    this.scene = scene;

    this.setupSettings();
  }

  public create(type: TileType): Tile {
    const settings = this.settingsLookup[type];
    const tile = new Tile();
    tile.setType(type);
    tile.setView(new TileView(this.scene, settings));
    return tile;
  }

  private setupSettings(): void {
    const settings = [
      {
        key: 'grass',
        type: TileType.Grass,
      },
      {
        key: 'water',
        type: TileType.Water,
      },
    ];

    settings.forEach((setting) => this.addSetting(setting));
  }

  private addSetting(setting: ITileSettings): void {
    this.settingsLookup[setting.type] = setting;
  }
}
