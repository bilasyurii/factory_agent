import Building from '../../world/building/building';
import World from '../../world/world';
import ProcessorType from './processor-type.enum';

export default abstract class WorldProcessor {
  public readonly type: ProcessorType;

  protected world: World;

  constructor(type: ProcessorType) {
    this.type = type;
  }

  public setWorld(world: World): void {
    this.world = world;
  }

  public abstract process(): void;

  protected iterate(callback: (building: Building) => void): void {
    this.world.forEachBuilding(callback, this);
  }
}
