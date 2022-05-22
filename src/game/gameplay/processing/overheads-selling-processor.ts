import GameConfig from '../../../config/game-config';
import ObjectUtils from '../../../utils/object-utils';
import ResourceType from '../../world/resource/resource-type.enum';
import ProcessingEventType from './processing-event-type.enum';
import ProcessorType from './processor-type.enum';
import WorldProcessor from './world-processor';

export default class OverheadsSellingProcessor extends WorldProcessor {
  constructor() {
    super(ProcessorType.Postprocessor);
  }

  public process(): void {
    ObjectUtils.forInEnum<ResourceType>(ResourceType, this.checkResource, this);
  }

  private checkResource(resourceType: ResourceType): void {
    if (resourceType === ResourceType.Money) {
      return;
    }

    const playerResources = this.player.getNonTransportableResources();
    const amount = playerResources.getAmount(resourceType);

    if (amount < GameConfig.SellOverheadFrom) {
      return;
    }

    const price = this.market.getPrice(resourceType);

    if (price === 0) {
      return;
    }

    const sellAmount = GameConfig.SellOverheadAmount;
    const income = sellAmount * price;

    if (GameConfig.DebugSelling) {
      console.log(`Sold ${price}x${sellAmount}=${income} of ${resourceType} for player`);
    }

    playerResources.subtractAmount(resourceType, sellAmount);
    playerResources.addAmount(ResourceType.Money, income);
    this.emit(ProcessingEventType.SellOverhead);
  }
}
