import HUD from '../ui/hud';
import World from '../world/world';
import IPlayerActionContext from './player/actions/player-action-context.interface';

export default interface IGameplayConfig {
  scene: Scene;
  world: World;
  hud: HUD;
  actionContext: IPlayerActionContext;
}
