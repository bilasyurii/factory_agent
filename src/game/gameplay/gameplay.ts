import GameConfig from "../../config/game-config";
import Player from "./player/player";
import AIPlayer from "./player/ai-player";

export default class Gameplay {
  private scene: Scene;
  private runner: TimerEvent;
  private player: Player;

  constructor(scene: Scene) {
    this.scene = scene;

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

  private processBuildings(): void {}

  private processPlayer(): void {
    const action = this.player.act();
    action.execute();
  }
}
