import ObjectUtils from '../../../utils/object-utils';
import ResourceType from '../resource/resource-type.enum';
import Tile from '../tiles/tile';
import Building from './building';
import IBuildingConfig, { ResourceDistribution } from './building-config.interface';
import BuildingType from './building-type.enum';
import IBuildingRequirementContext from './requirements/building-requirement-context.interface';
import BuildingRequirement from './requirements/building-requirement.abstract';

export default class BuildingSettings {
  public readonly name: string;
  public readonly type: BuildingType;
  public readonly startingViewKey: string;
  public readonly maxProductionCount: number;

  protected usage: ResourceDistribution = <any>{};
  protected gain: ResourceDistribution = <any>{};

  protected buildRequirements: BuildingRequirement[] = [];
  protected workRequirements: BuildingRequirement[] = [];

  protected building: Building;
  protected tile: Tile;

  constructor(config: IBuildingConfig) {
    this.name = config.name;
    this.type = config.type;
    this.startingViewKey = config.key;
    this.maxProductionCount = config.maxProductionCount || 3;

    ObjectUtils.copy(config.usage, this.usage);
    ObjectUtils.copy(config.gain, this.gain);

    this.buildRequirements = config.buildRequirements || [];
    this.workRequirements = config.workRequirements || [];
  }

  public setRequirementsContext(context: IBuildingRequirementContext): void {
    const setContext = function (requirement: BuildingRequirement) {
      requirement.setContext(context);
    };

    this.buildRequirements.forEach(setContext);
    this.workRequirements.forEach(setContext);
  }

  public getUsage(resourceType: ResourceType): number {
    return this.usage[resourceType] || 0;
  }

  public getGain(resourceType: ResourceType): number {
    return this.gain[resourceType] || 0;
  }

  public checkBuildRequirements(building: Building, tile: Tile): boolean {
    this.building = building;
    this.tile = tile;
    return this.buildRequirements.every(this.checkRequirement, this);
  }

  public checkWorkRequirements(building: Building): boolean {
    this.building = building;
    return this.workRequirements.every(this.checkRequirement, this);
  }

  protected checkRequirement(requirement: BuildingRequirement): boolean {
    return requirement.check(this.building, this.tile);
  }
}
