import World from '../world/world';
import IPlayerActionContext from './player/actions/player-action-context.interface';

export default interface IGameplayConfig {
  scene: Scene;
  world: World;
  actionContext: IPlayerActionContext;
}
