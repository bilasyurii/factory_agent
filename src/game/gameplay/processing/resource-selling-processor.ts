import Building from '../../world/building/building';
import ProcessorType from './processor-type.enum';
import WorldProcessor from './world-processor';
import BuildingType from '../../world/building/building-type.enum';
import ObjectUtils from '../../../utils/object-utils';
import ResourceType from '../../world/resource/resource-type.enum';
import GameConfig from '../../../config/game-config';
import ProcessingEventType from './processing-event-type.enum';

export default class ResourceSellingProcessor extends WorldProcessor {
  constructor() {
    super(ProcessorType.Preprocessor);
  }

  public process(): void {
    this.iterateByType(BuildingType.Storage, this.processBuilding);
  }

  private processBuilding(building: Building): void {
    const playerResources = this.player.getNonTransportableResources();
    const resources = building.getResources();
    const market = this.market;
    const emitter = this as EventEmitter;

    ObjectUtils.forInEnum<ResourceType>(ResourceType, function (resourceType) {
      const amount = ~~resources.getAmount(resourceType);

      if (amount <= 0) {
        return;
      }

      const price = market.getPrice(resourceType);

      if (price === 0) {
        return;
      }

      const income = amount * price;

      if (GameConfig.DebugSelling) {
        console.log(`Sold ${price}x${amount}=${income} of ${resourceType} for ${building.getType() + '_' + building.id}`);
      }

      resources.subtractAmount(resourceType, amount);
      playerResources.addAmount(ResourceType.Money, income);
      emitter.emit(ProcessingEventType.SellResource, income);
    });
  }
}
