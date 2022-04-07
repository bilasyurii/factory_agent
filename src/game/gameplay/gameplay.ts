import GameConfig from '../../config/game-config';
import Player from './player/player.abstract';
import AIPlayer from './player/ai-player';
import World from '../world/world';
import IGameplayConfig from './gameplay-config.interface';
import IPlayerActionContext from './player/actions/player-action-context.interface';

export default class Gameplay {
  private scene: Scene;
  private world: World;
  private runner: TimerEvent;
  private player: Player;
  private actionContext: IPlayerActionContext;

  constructor(config: IGameplayConfig) {
    this.scene = config.scene;
    this.world = config.world;
    this.actionContext = config.actionContext;

    this.initRunner();
    this.initPlayer();
  }

  public start(): void {
    this.runner.paused = false;
  }

  private initRunner(): void {
    this.runner = this.scene.time.addEvent({
      delay: GameConfig.GameplayTickInterval,
      loop: true,
      paused: true,
      callback: this.tick,
      callbackScope: this,
    });
  }

  private initPlayer(): void {
    this.player = new AIPlayer();
  }

  private tick(): void {
    this.processBuildings();
    this.processPlayer();
  }

  private processBuildings(): void {
  }

  private processPlayer(): void {
    const action = this.player.act();
    action.setContext(this.actionContext);
    action.execute();
  }
}
