import World from './world/world';
import BasicLevel from '../data/levels/basic-level.json';
import ILevelConfig from './world/loading/level-config.interface';
import Gameplay from './gameplay/gameplay';

export default class GameContainer extends Phaser.GameObjects.Container {
  private world: World;
  private gameplay: Gameplay;

  constructor(scene: Scene) {
    super(scene);

    this.initWorld();
    this.initGameplay();
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
