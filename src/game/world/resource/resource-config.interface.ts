import ResourceType from './resource-type.enum';

export default interface IResourceConfig {
  type: ResourceType;
  name: string;
}
