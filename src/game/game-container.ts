import World from './world/world';
import BasicLevel from '../data/levels/basic-level.json';
// import AllBuildingsLevel from '../data/levels/all-buildings-level.json';
import ILevelConfig from './world/loading/level-config.interface';
import Gameplay from './gameplay/gameplay';
import HUD from './ui/hud';
import GameplayEventType from './gameplay/gameplay-event-type.enum';
import ImportExportManager from './helpers/import-export-manager';

export default class GameContainer extends Phaser.GameObjects.Container {
  private world: World;
  private hud: HUD;
  private gameplay: Gameplay;
  private importExportManager: ImportExportManager;

  constructor(scene: Scene, hud: HUD) {
    super(scene);

    this.hud = hud;

    this.initWorld();
    this.initGameplay();
    this.initImportExportManager();
    this.setupEvents();
    this.start();
  }

  private initWorld(): void {
    const world = new World(this.scene);
    this.world = world;
    this.add(world);
  }

  private initGameplay(): void {
    this.gameplay = new Gameplay({
      scene: this.scene,
      world: this.world,
      hud: this.hud,
      actionContext: this.world.getActionContext(),
    });
  }

  private setupEvents(): void {
    this.gameplay.on(GameplayEventType.Lose, this.onLose, this);
    this.gameplay.on(GameplayEventType.Win, this.onWin, this);
    this.importExportManager.on(GameplayEventType.Import, this.onImport, this);
  }

  private initImportExportManager(): void {
    this.importExportManager = new ImportExportManager(this.hud);
  }

  private start(): void {
    this.world.reset();
    this.gameplay.reset();

    this.world
      .getLoader()
      .load(<ILevelConfig>BasicLevel);
      // .load(<ILevelConfig>AllBuildingsLevel);

    this.world.prepare();
    this.gameplay.prepare();

    this.gameplay.start();
  }

  private onLose(): void {
    this.start();
  }

  private onWin(): void {
    this.start();
  }

  private onImport(): void {
    this.start();
  }
}
