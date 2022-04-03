import ResourceType from "../resource/resource-type.enum";
import IBuildingConfig from "./building-config.interface";
import BuildingType from "./building-type.enum";

export default class BuildingSettings {
  public readonly name: string;
  public readonly type: BuildingType;
  public readonly startingViewKey: string;

  protected usage: Record<ResourceType, number> = <any>{};
  protected gain: Record<ResourceType, number> = <any>{};

  constructor(config: IBuildingConfig) {
    this.name = config.name;
    this.type = config.type;
    this.startingViewKey = config.key;
  }

  public getUsage(resourceType: ResourceType): number {
    return this.usage[resourceType] || 0;
  }

  public getGain(resourceType: ResourceType): number {
    return this.gain[resourceType] || 0;
  }

  public checkPlaceRequirements(): boolean {
    return true;
  }

  public checkWorkRequirements(): boolean {
    return true;
  }
}
