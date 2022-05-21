import GameConfig from '../../../config/game-config';
import ResourceBunch from '../../world/resource/resource-bunch';
import ResourceType from '../../world/resource/resource-type.enum';
import World from '../../world/world';
import Karma from '../karma/karma';
import PlayerAction from './actions/player-action.abstract';

export default abstract class Player {
  protected nonTransportableResources: ResourceBunch;
  protected world: World;
  protected worldWidth: number;
  protected worldHeight: number;
  protected karma: Karma;

  constructor() {
    this.initResources();
  }

  public init(world: World, karma: Karma): void {
    this.world = world;
    this.karma = karma;
    this.worldWidth = world.getWidth();
    this.worldHeight = world.getHeight();
  }

  public abstract act(): PlayerAction;

  public abstract postUpdate(): void;

  public getNonTransportableResources(): ResourceBunch {
    return this.nonTransportableResources;
  }

  protected initResources(): void {
    const nonTransportableResources = new ResourceBunch();
    this.nonTransportableResources = nonTransportableResources;
    nonTransportableResources.setAmount(ResourceType.Money, GameConfig.StartingMoney);
    nonTransportableResources.setAmount(ResourceType.Energy, GameConfig.StartingEnergy);
  }
}
