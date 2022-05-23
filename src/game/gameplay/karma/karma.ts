import KarmaItem from './karma-item';

export default class Karma {
  private items: KarmaItem[] = [];
  private persistentItems: KarmaItem[] = [];

  constructor() { }

  public reset(): void {
    this.items = [];
    this.persistentItems = [];
  }

  public preUpdate(): void {
    const items = this.items;
    items.forEach(this.updateItemLifetime, this);
    this.items = items.filter(this.filterActiveItems, this);
  }

  public addItem(item: KarmaItem): void {
    if (item.isPersistent()) {
      this.persistentItems.push(item);
    }

    this.items.push(item);
  }

  public getPersistentByName(name: string): KarmaItem {
    return this.persistentItems.find(function (item) {
      return item.name === name;
    });
  }

  public summarize(): number {
    const items = this.items;
    const weightsSum = items.reduce(Karma.calculateWeightsSum, 0);
    return items.reduce(function (sum, item) {
      return sum + item.value * item.weight;
    }, 0) / weightsSum;
  }

  private static calculateWeightsSum(sum: number, item: KarmaItem): number {
    return sum + item.weight;
  }

  private updateItemLifetime(item: KarmaItem): void {
    item.updateLifetime();
  }

  private filterActiveItems(item: KarmaItem): boolean {
    return item.isActive();
  }
}
