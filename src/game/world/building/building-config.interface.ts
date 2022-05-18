import ResourceType from '../resource/resource-type.enum';
import BuildingType from './building-type.enum';
import BuildingRequirement from './requirements/building-requirement.abstract';

export type ResourceDistribution = Record<ResourceType, number>;

export default interface IBuildingConfig {
  type: BuildingType;
  name: string;
  key: string;
  usage: ResourceDistribution,
  gain: ResourceDistribution,
  buildPrice: ResourceDistribution,
  maxProductionCount?: number;
  buildRequirements?: BuildingRequirement[],
  workRequirements?: BuildingRequirement[],
}
