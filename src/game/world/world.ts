import Building from './building/building';
import BuildingFactory from './building/building-factory';
import Grid from './grid/grid';
import GridEventType from './grid/grid-event-type.enum';
import WorldLoader from './loading/world-loader';
import Tile from './tiles/tile';
import TileFactory from './tiles/tile-factory';

export default class World extends Phaser.GameObjects.Container {
  private grid: Grid;
  private loader: WorldLoader;
  private tilesLayer: Container;
  private buildingsLayer: Container;
  private buildingFactory: BuildingFactory;
  private tileFactory: TileFactory;

  constructor(scene: Scene) {
    super(scene);

    this.initContainers();
    this.initGrid();
    this.setupEvents();
    this.initBuildingFactory();
    this.initTileFactory();
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

  private initBuildingFactory(): void {
    this.buildingFactory = new BuildingFactory(this.scene);
  }

  private initTileFactory(): void {
    this.tileFactory = new TileFactory(this.scene);
  }

  private initLoader(): void {
    this.loader = new WorldLoader({
      grid: this.grid,
      buildingFactory: this.buildingFactory,
      tileFactory: this.tileFactory,
    });
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
