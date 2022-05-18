import Tile from '../../tiles/tile';
import TileType from '../../tiles/tile-type.enum';
import Building from '../building';
import BuildingRequirement from './building-requirement.abstract';

export default class NeighborTileTypeRequirement extends BuildingRequirement {
  protected neededTypes: TileType[] = [];

  constructor(neededTypes: TileType[]) {
    super();

    this.neededTypes = neededTypes;
  }

  public check(building: Building, tile: Tile): boolean {
    return this.checkNeighbor(tile, 0, -1)
      || this.checkNeighbor(tile, 1, 0)
      || this.checkNeighbor(tile, 0, 1)
      || this.checkNeighbor(tile, -1, 0);
  }

  protected checkNeighbor(tile: Tile, offsetX: number, offsetY: number): boolean {
    const neighbor = this.world.getTileAt(tile.getX() + offsetX, tile.getY() + offsetY);

    if (!neighbor) {
      return false;
    }

    return this.neededTypes.indexOf(neighbor.getType()) !== -1;
  }
}
