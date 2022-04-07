import IPlayerActionContext from '../gameplay/player/actions/player-action-context.interface';
import Building from './building/building';
import BuildingFactory from './building/building-factory';
import BuildingView from './building/building-view';
import Grid from './grid/grid';
import GridEventType from './grid/grid-event-type.enum';
import WorldLoader from './loading/world-loader';
import TileFactory from './tiles/tile-factory';
import TileView from './tiles/tile-view';

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

  public getActionContext(): IPlayerActionContext {
    return {
      grid: this.grid,
      buildingFactory: this.buildingFactory,
      tileFactory: this.tileFactory,
    };
  }

  public forEachBuilding(cb: (building: Building) => void, ctx?: any) {
    this.grid.forEachBuilding(cb, ctx);
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
    grid.on(GridEventType.AddTileView, this.addTileView, this);
    grid.on(GridEventType.RemoveTileView, this.removeTileView, this);
    grid.on(GridEventType.AddBuildingView, this.addBuildingView, this);
    grid.on(GridEventType.RemoveBuildingView, this.removeBuildingView, this);
  }

  private addTileView(tileView: TileView): void {
    this.tilesLayer.add(tileView);
  }

  private removeTileView(tileView: TileView): void {
    this.tilesLayer.remove(tileView, true);
  }

  private addBuildingView(buildingView: BuildingView): void {
    this.buildingsLayer.add(buildingView);
  }

  private removeBuildingView(buildingView: BuildingView): void {    
    this.buildingsLayer.remove(buildingView, true);
  }
}
