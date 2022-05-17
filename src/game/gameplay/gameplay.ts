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
import ResourceProductionProcessor from './processing/resource-production-processor';
import IWorldProcessorConfig from './processing/world-processor-config.interface';
import TransportationManager from './transportation/transportation-manager';
import TransportationProcessor from './processing/transportation-processor';
import Market from './market/market';
import ResourceSellingProcessor from './processing/resource-selling-processor';

export default class Gameplay {
  private scene: Scene;
  private world: World;
  private runner: TimerEvent;
  private player: Player;
  private market: Market;
  private transportations: TransportationManager;
  private actionContext: IPlayerActionContext;
  private processorConfig: IWorldProcessorConfig;
  private preprocessors: WorldProcessor[] = [];
  private postprocessors: WorldProcessor[] = [];

  constructor(config: IGameplayConfig) {
    this.scene = config.scene;
    this.world = config.world;
    this.actionContext = config.actionContext;

    this.initRunner();
    this.initPlayer();
    this.initMarket();
    this.initTransportationManager();
    this.initProcessorConfig(); 
    this.initProcessors();
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

  private initMarket(): void {
    this.market = new Market();
  }

  private initTransportationManager(): void {
    this.transportations = new TransportationManager();
  }

  private initProcessorConfig(): void {
    this.processorConfig  = {
      world: this.world,
      player: this.player,
      market: this.market,
      transportations: this.transportations,
    };
  }

  private initProcessors(): void {
    this.addProcessor(new ConveyorViewConnectionsProcessor());
    this.addProcessor(new ResourceDistributionProcessor());
    this.addProcessor(new TransportationProcessor());
    this.addProcessor(new ResourceProductionProcessor());
    this.addProcessor(new ResourceSellingProcessor());
  }

  private addProcessor(processor: WorldProcessor): void {
    processor.setup(this.processorConfig);

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
    // console.log(this.player.getNonTransportableResources().toString());
    // console.warn(this.world.getBuildingAt(4, 5).getResources().toString());
    // console.warn(this.world.getBuildingAt(7, 5).getResources().toString());
    // console.warn(this.world.getBuildingAt(4, 7).getResources().toString());
    // console.warn(this.world.getBuildingAt(5, 7).getResources().toString());
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
