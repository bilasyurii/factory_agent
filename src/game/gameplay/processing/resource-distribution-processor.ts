import ObjectUtils from '../../../utils/object-utils';
import Building from '../../world/building/building';
import BuildingType from '../../world/building/building-type.enum';
import ResourceType from '../../world/resource/resource-type.enum';
import Resources from '../../world/resource/resources';
import ProcessorType from './processor-type.enum';
import WorldProcessor from './world-processor';

interface IResourceOrder {
  destination: Building;
  amount: number;
  distance: number;
  weightedAmount: number;
}

interface IResourceOffer {
  supplier: Building;
  amount: number;
  ordersWeightedSum: number;
  ordersSum: number;
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
    this.distributeOffers();
    this.distributeNonTransportableResources();
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
    this.iterate(this.createBuildingOffers);
  }

  private placeOrders(): void {
    this.iterate(this.placeBuildingOrders);
  }

  private distributeOffers(): void {
    const transportation = this.transportations;
    const pathfinder = this.world.getPathfinder();

    ObjectUtils.forInObject<ResourceType, IResourceOffer[]>(this.transportableOffers, function (resourceType, offers) {
      offers.forEach(function (offer) {
        const { amount, orders, supplier, ordersSum, ordersWeightedSum } = offer;
        const amountLeft = amount - ordersSum;
        const canFulfillAll = (amountLeft >= 0);
        const amountCoefficient = amount / ordersWeightedSum;

        orders.forEach(function (order) {
          transportation.add({
            source: supplier,
            destination: order.destination,
            distance: order.distance,
            amount: canFulfillAll ? order.amount : order.weightedAmount * amountCoefficient,
            resourceType,
            transportable: true,
          });
        });

        if (canFulfillAll) {
          const storage = pathfinder.getClosestByType(supplier, BuildingType.Storage);

          if (!storage) {
            return;
          }

          transportation.add({
            source: supplier,
            destination: storage,
            distance: 0,
            amount: amountLeft,
            resourceType,
            transportable: true,
          });
        }
      });
    });
  }

  private distributeNonTransportableResources(): void {
    const transportation = this.transportations;
    const playerResources = this.player.getNonTransportableResources();

    ObjectUtils.forInObject<ResourceType, IResourceOrder[]>(this.nonTransportableOrders, function (resourceType, orders) {
      const available = playerResources.getAmount(resourceType);
      const amountSum = orders.reduce(function (previous, current) {
        return previous + current.amount;
      }, 0);
      const amountCoefficient = available / amountSum;

      orders.forEach(function (order) {
        const amount = order.amount;
        transportation.add({
          source: null,
          destination: order.destination,
          distance: 0,
          amount: Math.min(amount, amount * amountCoefficient),
          resourceType,
          transportable: false,
        });
      });
    });
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
          ordersSum: 0,
          ordersWeightedSum: 0,
          orders: [],
        });
      }
    });
  }

  private placeBuildingOrders(building: Building): void {
    const settings = building.getSettings();
    const buildingResources = building.getResources();
    const transportableOffers = this.transportableOffers;
    const nonTransportableOrders = this.nonTransportableOrders;
    const pathfinder = this.world.getPathfinder();

    ObjectUtils.forInEnum<ResourceType>(ResourceType, function (resourceType) {
      const usage = settings.getUsage(resourceType);

      if (usage <= 0) {
        return;
      }

      const resource = Resources.get(resourceType);
      const buildingResourceAmount = buildingResources.getAmount(resourceType);
      const amountNeeded = usage - buildingResourceAmount;

      if (amountNeeded <= 0) {
        return;
      }

      if (!resource.transportable) {
        nonTransportableOrders[resourceType].push({
          destination: building,
          amount: amountNeeded,
          distance: 0,
          weightedAmount: amountNeeded,
        });
        return;
      }

      const resourceOffers = transportableOffers[resourceType];
      const count = resourceOffers.length;

      for (let i = 0; i < count; ++i) {
        const offer = resourceOffers[i];
        const distance = pathfinder.getPathLength(offer.supplier, building);
        const weightedAmount = amountNeeded / distance;
        offer.orders.push({
          destination: building,
          amount: amountNeeded,
          distance,
          weightedAmount,
        });
        offer.ordersSum += amountNeeded;
        offer.ordersWeightedSum += weightedAmount;
      }
    });
  }
}
