import Transportation from './transportation';
import ITransportationConfig from './transportation-config.interface';

export default class TransportationManager {
  private transportations: Transportation[] = [];

  constructor() { }

  public reset(): void {
    this.transportations = [];
  }

  public add(config: ITransportationConfig): void {
    if (config.amount > 0) {
      this.transportations.push(new Transportation(config));
    }
  }

  public forEach(cb: (transportation: Transportation) => void, ctx?: any): void {
    this.transportations.forEach(cb, ctx);
  }

  public removeCompleted(): void {
    this.transportations = this.transportations.filter(TransportationManager.filterTransportation);
  }

  private static filterTransportation(transportation: Transportation): boolean {
    return !transportation.completed;
  }
}
