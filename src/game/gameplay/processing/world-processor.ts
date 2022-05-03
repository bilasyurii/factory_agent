import Building from '../../world/building/building';
import World from '../../world/world';
import Player from '../player/player.abstract';
import TransportationManager from '../transportation/transportation-manager';
import ProcessorType from './processor-type.enum';
import IWorldProcessorConfig from './world-processor-config.interface';

export default abstract class WorldProcessor {
  public readonly type: ProcessorType;

  protected world: World;
  protected player: Player;
  protected transportations: TransportationManager;

  constructor(type: ProcessorType) {
    this.type = type;
  }

  public setup(config: IWorldProcessorConfig): void {
    this.world = config.world;
    this.player = config.player;
    this.transportations = config.transportations;
  }

  public abstract process(): void;

  protected iterate(callback: (building: Building) => void): void {
    this.world.forEachBuilding(callback, this);
  }
}
