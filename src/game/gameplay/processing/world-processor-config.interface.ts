import World from '../../world/world';
import Market from '../market/market';
import Player from '../player/player.abstract';
import TransportationManager from '../transportation/transportation-manager';

export default interface IWorldProcessorConfig {
  world: World;
  player: Player;
  market: Market;
  transportations: TransportationManager;
}
