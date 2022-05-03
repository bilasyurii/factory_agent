import Transportation from '../transportation/transportation';
import ProcessorType from './processor-type.enum';
import WorldProcessor from './world-processor';

export default class TransportationProcessor extends WorldProcessor {
  constructor() {
    super(ProcessorType.Preprocessor);
  }

  public process(): void {
    const transportations = this.transportations;
    transportations.forEach(this.processTransportation, this);
    transportations.removeCompleted();
  }

  private processTransportation(transportation: Transportation): void {
    const {
      source,
      resourceType,
      amount,
      destination,
    } = transportation;
    const resources = (source ? source.getResources() : this.player.getNonTransportableResources());
    resources.subtractAmount(resourceType, amount);
    destination.getResources().addAmount(resourceType, amount);
    transportation.completed = true;
  }
}
