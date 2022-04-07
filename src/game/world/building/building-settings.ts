import ResourceType from '../resource/resource-type.enum';
import Tile from '../tiles/tile';
import Building from './building';
import IBuildingConfig, { ResourceDistribution } from './building-config.interface';
import BuildingType from './building-type.enum';
import BuildingRequirement from './requirements/building-requirement.abstract';

export default class BuildingSettings {
  public readonly name: string;
  public readonly type: BuildingType;
  public readonly startingViewKey: string;

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

    this.copyDistribution(config.usage, this.usage);
    this.copyDistribution(config.gain, this.gain);

    this.buildRequirements = config.buildRequirements || [];
    this.workRequirements = config.workRequirements || [];
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

  private copyDistribution(from: ResourceDistribution, to: ResourceDistribution): void {
    for (const type in from) {
      if (Object.prototype.hasOwnProperty.call(from, type)) {
        to[<ResourceType>type] = from[<ResourceType>type];
      }
    }
  }

  protected checkRequirement(requirement: BuildingRequirement): boolean {
    return requirement.check(this.building, this.tile);
  }
}
