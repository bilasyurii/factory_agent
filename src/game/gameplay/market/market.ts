import ResourceType from '../../world/resource/resource-type.enum';

export default class Market {
  private prices: Record<ResourceType, number> = <any>{};

  constructor() {
    this.initDefaultPrices();
  }

  public getPrice(resourceType: ResourceType): number {
    return this.prices[resourceType];
  }

  private initDefaultPrices(): void {
    const prices = this.prices;
    prices[ResourceType.Cars] = 150;
    prices[ResourceType.Coal] = 10;
    prices[ResourceType.Energy] = 1;
    prices[ResourceType.Fuel] = 30;
    prices[ResourceType.Heat] = 0;
    prices[ResourceType.IronOre] = 8;
    prices[ResourceType.Metal] = 20;
    prices[ResourceType.Money] = 0;
    prices[ResourceType.Oil] = 5;
    prices[ResourceType.Plastic] = 15;
    prices[ResourceType.Tools] = 50;
    prices[ResourceType.Toys] = 25;
    prices[ResourceType.Water] = 2;
  }
}
