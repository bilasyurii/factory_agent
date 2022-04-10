import ObjectUtils from '../../../utils/object-utils';
import Building from '../../world/building/building';
import ResourceType from '../../world/resource/resource-type.enum';
import Resources from '../../world/resource/resources';
import ProcessorType from './processor-type.enum';
import WorldProcessor from './world-processor';

interface IResourceOrder {
  destination: Building;
  amount: number;
  distance: number;
}

interface IResourceOffer {
  supplier: Building;
  amount: number;
  orders: IResourceOrder[];
}

export default class ResourceDistributionProcessor extends WorldProcessor {
  private transportableOffers: Record<ResourceType, IResourceOffer[]>;
  private nonTransportableOrders: Record<ResourceType, IResourceOrder[]>;

  constructor() {
    super(ProcessorType.Preprocessor);
  }

  public process(): void {
    this.reset();
    this.createOffers();
    this.placeOrders();
  }

  private reset(): void {
    const transportableOffers = <any>{};
    const nonTransportableOrders = <any>{};

    this.transportableOffers = transportableOffers;
    this.nonTransportableOrders = nonTransportableOrders;

    ObjectUtils.forInEnum<ResourceType>(ResourceType, function (resourceType) {
      if (Resources.get(resourceType).transportable) {
        transportableOffers[resourceType] = [];
      } else {
        nonTransportableOrders[resourceType] = [];
      }
    });
  }

  private createOffers(): void {
    this.world.forEachBuilding(this.createBuildingOffers, this);
  }

  private placeOrders(): void {
    this.world.forEachBuilding(this.placeBuildingOrders, this);
  }

  private createBuildingOffers(building: Building): void {
    const settings = building.getSettings();
    const resources = building.getResources();
    const transportableOffers = this.transportableOffers;

    ObjectUtils.forInEnum<ResourceType>(ResourceType, function (resourceType) {
      const resource = Resources.get(resourceType);

      if (!resource.transportable) {
        return;
      }

      const available = resources.getAmount(resourceType);

      if (available > 0 && settings.getGain(resourceType) > 0) {
        transportableOffers[resourceType].push({
          supplier: building,
          amount: available,
          orders: [],
        });
      }
    });
  }

  private placeBuildingOrders(building: Building): void {
    const settings = building.getSettings();
    const transportableOffers = this.transportableOffers;
    const nonTransportableOrders = this.nonTransportableOrders;
    const pathfinder = this.world.getPathfinder();

    ObjectUtils.forInEnum<ResourceType>(ResourceType, function (resourceType) {
      const usage = settings.getUsage(resourceType);

      if (usage <= 0) {
        return;
      }

      const resource = Resources.get(resourceType);

      if (!resource.transportable) {
        nonTransportableOrders[resourceType].push({
          destination: building,
          amount: usage,
          distance: 0,
        });
        return;
      }

      const resourceOffers = transportableOffers[resourceType];
      const count = resourceOffers.length;

      for (let i = 0; i < count; ++i) {
        const offer = resourceOffers[i];
        offer.orders.push({
          destination: building,
          amount: usage,
          distance: pathfinder.getPathLength(offer.supplier, building),
        });
      }
    });
  }
}
