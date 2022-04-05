import BuildingType from './building-type.enum';

export default interface IBuildingConfig {
  type: BuildingType;
  name: string;
  key: string;
}
