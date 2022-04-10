import GameConfig from '../../config/game-config';
import Player from './player/player.abstract';
import AIPlayer from './player/ai-player';
import World from '../world/world';
import IGameplayConfig from './gameplay-config.interface';
import IPlayerActionContext from './player/actions/player-action-context.interface';
import WorldProcessor from './processing/world-processor';
import ConveyorViewConnectionsProcessor from './processing/conveyor-view-connections-processor';
import ProcessorType from './processing/processor-type.enum';
import ResourceDistributionProcessor from './processing/resource-distribution-processor';

export default class Gameplay {
  private scene: Scene;
  private world: World;
  private runner: TimerEvent;
  private player: Player;
  private actionContext: IPlayerActionContext;
  private preprocessors: WorldProcessor[] = [];
  private postprocessors: WorldProcessor[] = [];

  constructor(config: IGameplayConfig) {
    this.scene = config.scene;
    this.world = config.world;
    this.actionContext = config.actionContext;

    this.initProcessors();
    this.initRunner();
    this.initPlayer();
  }

  public start(): void {
    this.runner.paused = false;
  }

  private initProcessors(): void {
    this.addProcessor(new ConveyorViewConnectionsProcessor());
    this.addProcessor(new ResourceDistributionProcessor());
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

  private addProcessor(processor: WorldProcessor): void {
    processor.setWorld(this.world);

    switch (processor.type) {
      case ProcessorType.Preprocessor:
        this.preprocessors.push(processor);
        break;
      case ProcessorType.Postprocessor:
        this.postprocessors.push(processor);
        break;
    }
  }

  private tick(): void {
    this.preUpdate();
    this.preProcess();
    this.processPlayer();
    this.postProcess();
  }

  private preUpdate(): void {
    this.world.getPathfinder().update();
  }

  private preProcess(): void {
    this.preprocessors.forEach(this.executeProcessor, this);
  }

  private postProcess(): void {
    this.postprocessors.forEach(this.executeProcessor, this);
  }

  private processPlayer(): void {
    const action = this.player.act();
    action.setContext(this.actionContext);
    action.execute();
  }

  private executeProcessor(processor: WorldProcessor): void {
    processor.process();
  }
}
