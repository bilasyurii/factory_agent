import GameConfig from '../../../config/game-config';
import Building from '../../world/building/building';
import ResourceType from '../../world/resource/resource-type.enum';
import ITransportationConfig from './transportation-config.interface';

export default class Transportation {
  public source: Building;
  public destination: Building;
  public distance: number;
  public resourceType: ResourceType;
  public amount: number;
  public transportable: boolean;
  public completed: boolean = false;

  constructor(config: ITransportationConfig) {
    this.source = config.source;
    this.destination = config.destination;
    this.distance = config.distance;
    this.amount = config.amount;
    this.resourceType = config.resourceType;
    this.transportable = config.transportable;

    if (GameConfig.Debug) {
      console.log(`Transportation of ${this.amount}x${this.resourceType} from ${this.source ? this.source.id : 'player'} to ${this.destination ? this.destination.id : 'player'}`);
    }
  }
}
