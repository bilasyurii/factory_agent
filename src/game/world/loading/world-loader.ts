import Building from '../building/building';
import BuildingView from '../building/building-view';
import Grid from '../grid/grid';
import Tile from '../tiles/tile';
import TileView from '../tiles/tile-view';

export default class WorldLoader {
  private grid: Grid;
  private scene: Scene;

  constructor(grid: Grid) {
    this.grid = grid;
    this.scene = grid.scene;
  }

  public loadFromJSON(json: any): void {
    console.log(json);
    for (let i = 0; i < 10; ++i) {
      for (let j = 0; j < 10; ++j) {
        this.createEmpty(i, j);
      }
    }

    const building = new Building();
    building.setView(new BuildingView(this.scene, {
      key: 'refinery',
    }));
    this.grid.getTile(2, 3).setBuilding(building);
    this.grid.addBuilding(building);
  }

  private createEmpty(x: number, y: number): void {
    const tile = new Tile();

    tile.setView(new TileView(this.scene, {
      key: 'platform',
    }));

    tile.setPosition(x, y);

    this.grid.addTile(tile);
  }
}
