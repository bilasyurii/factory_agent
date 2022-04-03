import Building from './building/building';
import Grid from './grid/grid';
import GridEventType from './grid/grid-event-type.enum';
import WorldLoader from './loading/world-loader';
import Tile from './tiles/tile';

export default class World extends Phaser.GameObjects.Container {
  private grid: Grid;
  private loader: WorldLoader;
  private tilesLayer: Container;
  private buildingsLayer: Container;

  constructor(scene: Scene) {
    super(scene);

    this.initContainers();
    this.initGrid();
    this.setupEvents();
    this.initLoader();
  }

  public getLoader(): WorldLoader {
    return this.loader;
  }

  private initContainers(): void {
    this.tilesLayer = new Phaser.GameObjects.Container(this.scene);
    this.buildingsLayer = new Phaser.GameObjects.Container(this.scene);

    this.add([
      this.tilesLayer,
      this.buildingsLayer,
    ]);
  }

  private initGrid(): void {
    this.grid = new Grid(this.scene, {
      width: 10,
      height: 10,
    });
  }

  private initLoader(): void {
    this.loader = new WorldLoader(this.grid);
  }

  private setupEvents(): void {
    const grid = this.grid;
    grid.on(GridEventType.TileAdded, this.onTileAdded, this);
    grid.on(GridEventType.BuildingAdded, this.onBuildingAdded, this);
  }

  private onTileAdded(tile: Tile): void {
    this.tilesLayer.add(tile.getView());
  }

  private onBuildingAdded(building: Building): void {
    this.buildingsLayer.add(building.getView());
  }
}
