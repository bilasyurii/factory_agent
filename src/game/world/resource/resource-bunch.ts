import ResourceItem from './resource-item';
import ResourceType from './resource-type.enum';
import Resources from './resources';

export default class ResourceBunch {
  private lookup: Record<ResourceType, ResourceItem> = <any>{};

  constructor() { }

  public getAmount(type: ResourceType): number {
    const item = this.lookup[type];
    return item ? item.getAmount() : 0;
  }

  public setAmount(type: ResourceType, amount: number): void {
    this.getOrCreateItem(type).setAmount(amount);
  }

  private getOrCreateItem(type: ResourceType): ResourceItem {
    const lookup = this.lookup;
    let item = lookup[type];

    if (!item) {
      const resource = Resources.get(type);
      item = new ResourceItem(resource);
      lookup[type] = item;
    }

    return item;
  }
}
