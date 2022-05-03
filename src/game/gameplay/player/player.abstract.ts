import GameConfig from '../../../config/game-config';
import ResourceBunch from '../../world/resource/resource-bunch';
import ResourceType from '../../world/resource/resource-type.enum';
import PlayerAction from './actions/player-action.abstract';

export default abstract class Player {
  protected nonTransportableResources: ResourceBunch;

  constructor() {
    this.initResources();
  }

  public abstract act(): PlayerAction;

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
