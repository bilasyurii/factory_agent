export default class KarmaItem {
  public readonly name: string;
  public readonly weight: number;
  public value: number;

  private lifeTime: number;

  constructor(name: string, weight: number, value: number, lifeTime: number = 1) {
    this.name = name;
    this.weight = weight;
    this.value = value;
    this.lifeTime = lifeTime;
  }

  public isActive(): boolean {
    return this.lifeTime > 0;
  }

  public isPersistent(): boolean {
    return !isFinite(this.lifeTime);
  }

  public updateLifetime(): void {
    --this.lifeTime;
  }
}
