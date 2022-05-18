import TileType from '../../tiles/tile-type.enum';
import TileTypeRequirement from './tile-type-requirement';

export default class WaterRequirement extends TileTypeRequirement {
  constructor() {
    super([
      TileType.Water,
    ]);
  }
}
