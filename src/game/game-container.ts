import World from './world/world';
import BasicLevel from '../data/levels/basic-level.json';
import ILevelConfig from './world/loading/level-config.interface';
import Gameplay from './gameplay/gameplay';
import HUD from './ui/hud';

export default class GameContainer extends Phaser.GameObjects.Container {
  private world: World;
  private hud: HUD;
  private gameplay: Gameplay;

  constructor(scene: Scene) {
    super(scene);

    this.initWorld();
    this.initHUD();
    this.initGameplay();
    this.start();
  }

  private initWorld(): void {
    const world = new World(this.scene);
    this.world = world;
    this.add(world);
  }

  private initHUD(): void {
    const hud = new HUD(this.scene);
    this.hud = hud;
    this.add(hud);
  }

  private initGameplay(): void {
    this.gameplay = new Gameplay({
      scene: this.scene,
      world: this.world,
      hud: this.hud,
      actionContext: this.world.getActionContext(),
    });
  }

  private start(): void {
    this.world
      .getLoader()
        .load(<ILevelConfig>BasicLevel);
    this.gameplay.onWorldLoaded();
    this.gameplay.start();
  }
}
