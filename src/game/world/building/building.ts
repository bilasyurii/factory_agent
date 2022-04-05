import Tile from '../tiles/tile';
import BuildingView from './building-view';

export default class Building {
  protected view: BuildingView = null;
  protected tile: Tile = null;

  public getX(): number {
    return this.tile.getX();
  }

  public getY(): number {
    return this.tile.getY();
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
}
