import ResourceBunch from '../resource/resource-bunch';
import Tile from '../tiles/tile';
import BuildingSettings from './building-settings';
import BuildingType from './building-type.enum';
import BuildingView from './building-view';

export type BuildingId = number;

export default class Building {
  private static nextId: BuildingId = 0;

  public static resetIds(): void {
    Building.nextId = 0;
  }

  public readonly id: BuildingId = Building.nextId++;

  protected settings: BuildingSettings;
  protected view: BuildingView = null;
  protected tile: Tile = null;
  protected resources: ResourceBunch;

  constructor(settings: BuildingSettings) {
    this.settings = settings;

    this.initResources();
  }

  public getX(): number {
    return this.tile.getX();
  }

  public getY(): number {
    return this.tile.getY();
  }

  public getPosition(): Vector2 {
    return this.tile.getPosition();
  }

  public getSettings(): BuildingSettings {
    return this.settings;
  }

  public getType(): BuildingType {
    return this.settings.type;
  }

  public setView(view: BuildingView): void {
    const prevView = this.view;

    if (prevView !== view) {
      if (prevView) {
        this.view = null;
        prevView.setBuilding(null);
      }
  
      this.view = view;

      if (view) {
        view.setBuilding(this);
      }
    }
  }

  public getView(): BuildingView {
    return this.view;
  }

  public setTile(tile: Tile): void {
    const prevTile = this.tile;

    if (prevTile !== tile) {
      if (prevTile) {
        this.tile = null;
        prevTile.setBuilding(null);
      }
  
      this.tile = tile;

      const view = this.view;

      if (view) {
        view.updatePosition();
      }

      if (tile) {
        tile.setBuilding(this);
      }
    }
  }

  public getTile(): Tile {
    return this.tile;
  }

  public getResources(): ResourceBunch {
    return this.resources;
  }

  protected initResources(): void {
    this.resources = new ResourceBunch();
  }
}
