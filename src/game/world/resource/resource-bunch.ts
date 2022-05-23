import ObjectUtils from '../../../utils/object-utils';
import ResourceItem from './resource-item';
import ResourceType from './resource-type.enum';
import Resources from './resources';

export default class ResourceBunch {
  private lookup: Record<ResourceType, ResourceItem>;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.lookup = <any>{};
  }

  public getAmount(type: ResourceType): number {
    const item = this.lookup[type];
    return item ? item.getAmount() : 0;
  }

  public setAmount(type: ResourceType, amount: number): void {
    this.getOrCreateItem(type).setAmount(amount);
  }

  public addAmount(type: ResourceType, amount: number): void {
    const item = this.getOrCreateItem(type);
    item.addAmount(amount);
  }

  public subtractAmount(type: ResourceType, amount: number): void {
    const item = this.getOrCreateItem(type);
    item.subtractAmount(amount);
  }

  public toString(): string {
    let str = '{';

    ObjectUtils.forInObject<ResourceType, ResourceItem>(this.lookup, function (resourceType, item) {
      str += `| ${resourceType} : ${item.getAmount()} |`;
    });

    return str + '}';
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
