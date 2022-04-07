import TileType from '../../tiles/tile-type.enum';
import TileTypeRequirement from './tile-type-requirement';

export default class SolidGroundRequirement extends TileTypeRequirement {
  constructor() {
    super([
      TileType.Platform,
      TileType.Grass,
      TileType.Sand,
    ]);
  }
}
