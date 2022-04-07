import Tile from '../../tiles/tile';
import World from '../../world';
import Building from '../building';
import IBuildingRequirementContext from './building-requirement-context.interface';

export default abstract class BuildingRequirement {
  protected world: World;

  public setContext(context: IBuildingRequirementContext): void {
    this.world = context.world;
  }

  public abstract check(building: Building, tile: Tile): boolean;
}
