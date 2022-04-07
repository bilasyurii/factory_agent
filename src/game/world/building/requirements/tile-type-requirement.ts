import Tile from '../../tiles/tile';
import TileType from '../../tiles/tile-type.enum';
import Building from '../building';
import BuildingRequirement from './building-requirement.abstract';

export default class TileTypeRequirement extends BuildingRequirement {
  protected allowedTypes: TileType[] = [];

  constructor(allowedTypes: TileType[]) {
    super();

    this.allowedTypes = allowedTypes;
  }

  public check(building: Building, tile: Tile): boolean {
    return this.allowedTypes.indexOf(tile.getType()) !== -1;
  }
}
