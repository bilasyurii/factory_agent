import World from '../../world/world';
import Player from '../player/player.abstract';
import TransportationManager from '../transportation/transportation-manager';

export default interface IWorldProcessorConfig {
  world: World;
  player: Player;
  transportations: TransportationManager;
}
