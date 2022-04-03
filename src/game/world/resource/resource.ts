import IResourceConfig from "./resource-config.interface";
import ResourceType from "./resource-type.enum";

export default class Resource {
  public readonly type: ResourceType;
  public readonly name: string;

  constructor(config: IResourceConfig) {
    this.type = config.type;
    this.name = config.name;
  }
}
