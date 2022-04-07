import GameConfig from '../../../config/game-config';
import ResourceItem from '../../world/resource/resource-item';
import ResourceType from '../../world/resource/resource-type.enum';
import Resources from '../../world/resource/resources';
import PlayerAction from './actions/player-action.abstract';

export default abstract class Player {
  protected money: ResourceItem;

  constructor() {
    this.initMoney();
  }

  public abstract act(): PlayerAction;

  protected initMoney(): void {
    const resource = Resources.get(ResourceType.Money);
    const money = new ResourceItem(resource);
    this.money = money;
    money.setAmount(GameConfig.StartingMoney);
  }
}
