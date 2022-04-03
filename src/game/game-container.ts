import World from './world/world';
import BasicLevel from '../data/levels/basic-level.json';
import ILevelConfig from './world/loading/level-config.interface';

export default class GameContainer extends Phaser.GameObjects.Container {
  private world: World;

  constructor(scene: Scene) {
    super(scene);

    this.initWorld();
  }

  private initWorld(): void {
    const world = new World(this.scene);
    this.world = world;
    this.add(world);

    world
      .getLoader()
      .load(<ILevelConfig>BasicLevel);
  }
}
