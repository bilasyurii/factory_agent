import TileType from '../../tiles/tile-type.enum';
import NeighborTileTypeRequirement from './neighbor-tile-type-requirement';

export default class NearShoreRequirement extends NeighborTileTypeRequirement {
  constructor() {
    super([
      TileType.Grass,
      TileType.Platform,
      TileType.Sand,
    ]);
  }
}
