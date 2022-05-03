import Resource from './resource';

export default class ResourceItem {
  public readonly resource: Resource;
  protected amount: number = 0;

  constructor(resource: Resource) {
    this.resource = resource;
  }

  public getAmount(): number {
    return this.amount;
  }

  public setAmount(amount: number): void {
    this.amount = amount;
  }

  public addAmount(amount: number): void {
    this.amount += amount;
  }

  public subtractAmount(amount: number): void {
    const newAmount = this.amount - amount;
    this.amount = (newAmount < 0.01 ? 0 : newAmount);
  }
}
