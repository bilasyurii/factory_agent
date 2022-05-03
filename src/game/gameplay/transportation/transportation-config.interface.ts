import Building from '../../world/building/building';
import ResourceType from '../../world/resource/resource-type.enum';

export default interface ITransportationConfig {
  source: Building;
  destination: Building;
  distance: number;
  amount: number;
  resourceType: ResourceType;
  transportable: boolean;
}
