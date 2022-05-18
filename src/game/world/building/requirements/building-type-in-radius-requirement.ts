import Tile from '../../tiles/tile';
import Building from '../building';
import BuildingType from '../building-type.enum';
import BuildingRequirement from './building-requirement.abstract';

export default class BuildingTypeInRadiusRequirement extends BuildingRequirement {
  protected neededTypes: BuildingType[] = [];
  protected radius: number;

  constructor(neededTypes: BuildingType[], radius: number) {
    super();

    this.neededTypes = neededTypes;
    this.radius = radius;
  }

  public check(building: Building, tile: Tile): boolean {
    const radius = this.radius;
    const tileX = tile.getX();
    const tileY = tile.getY();

    for (let xOffset = -radius; xOffset <= radius; ++xOffset) {
      const x = tileX + xOffset;

      for (let yOffset = -radius; yOffset <= radius; ++yOffset) {
        if (this.checkBuilding(x, tileY + yOffset)) {
          return true;
        }
      }
    }

    return false;
  }

  protected checkBuilding(x: number, y: number): boolean {
    const building = this.world.getBuildingAt(x, y);

    if (!building) {
      return false;
    }

    return this.neededTypes.indexOf(building.getType()) !== -1;
  }
}
