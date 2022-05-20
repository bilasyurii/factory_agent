import IPlayerActionContext from '../gameplay/player/actions/player-action-context.interface';
import Building from './building/building';
import BuildingFactory from './building/building-factory';
import BuildingType from './building/building-type.enum';
import BuildingView from './building/building-view';
import Grid from './grid/grid';
import GridEventType from './grid/grid-event-type.enum';
import Pathfinder from './grid/pathfinding/pathfinder';
import WorldLoader from './loading/world-loader';
import Tile from './tiles/tile';
import TileFactory from './tiles/tile-factory';
import TileView from './tiles/tile-view';

export default class World extends Phaser.GameObjects.Container {
  private grid: Grid;
  private loader: WorldLoader;
  private tilesLayer: Container;
  private buildingsLayer: Container;
  private buildingFactory: BuildingFactory;
  private tileFactory: TileFactory;
  private pathfinder: Pathfinder;

  constructor(scene: Scene) {
    super(scene);

    this.initContainers();
    this.initGrid();
    this.setupEvents();
    this.initBuildingFactory();
    this.initTileFactory();
    this.initLoader();
    this.initPathfinder();
  }

  public getWidth(): number {
    return this.grid.getWidth();
  }

  public getHeight(): number {
    return this.grid.getHeight();
  }

  public getLoader(): WorldLoader {
    return this.loader;
  }

  public getPathfinder(): Pathfinder {
    return this.pathfinder;
  }

  public getActionContext(): IPlayerActionContext {
    return {
      player: null,
      grid: this.grid,
      buildingFactory: this.buildingFactory,
      tileFactory: this.tileFactory,
    };
  }

  public forEachBuilding(cb: (building: Building) => void, ctx?: any) {
    this.grid.forEachBuilding(cb, ctx);
  }

  public getBuildingAt(x: number, y: number): Building {
    return this.grid.getBuilding(x, y);
  }

  public getTileAt(x: number, y: number): Tile {
    return this.grid.getTile(x, y);
  }

  public getBuildingsByType(type: BuildingType): Building[] {
    return this.grid.getBuildingsByType(type);
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
    this.buildingFactory = new BuildingFactory(this.scene, this);
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

  private initPathfinder(): void {
    this.pathfinder = new Pathfinder(this.grid);
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
    this.pathfinder.markDirty();
  }

  private removeBuildingView(buildingView: BuildingView): void {    
    this.buildingsLayer.remove(buildingView, true);
    this.pathfinder.markDirty();
  }
}
