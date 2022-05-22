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
import OverheadsSellingProcessor from './processing/overheads-selling-processor';
import Karma from './karma/karma';
import KarmaController from './karma/karma-controller';
import HUD from '../ui/hud';
import ProcessingEventType from './processing/processing-event-type.enum';
import PathfinderEventType from '../world/grid/pathfinding/pathfinder-event-type.enum';

export default class Gameplay {
  private scene: Scene;
  private world: World;
  private hud: HUD;
  private runner: TimerEvent;
  private player: Player;
  private karma: Karma;
  private karmaController: KarmaController;
  private market: Market;
  private transportations: TransportationManager;
  private actionContext: IPlayerActionContext;
  private processorConfig: IWorldProcessorConfig;
  private preprocessors: WorldProcessor[] = [];
  private postprocessors: WorldProcessor[] = [];

  constructor(config: IGameplayConfig) {
    this.scene = config.scene;
    this.world = config.world;
    this.hud = config.hud;
    this.actionContext = config.actionContext;

    this.initRunner();
    this.initKarma();
    this.initKarmaController();
    this.initPlayer();
    this.initMarket();
    this.initTransportationManager();
    this.initProcessorConfig(); 
    this.initProcessors();
    this.setupEvents();
  }

  public onWorldLoaded(): void {
    this.world.getPathfinder().update(true);
    this.player.init(this.world, this.karma);
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

  private initKarma(): void {
    this.karma = new Karma();
  }

  private initKarmaController(): void {
    const karmaController = new KarmaController(this.karma);
    this.karmaController = karmaController;
    this.actionContext.karmaController = karmaController;
    karmaController.reset();
  }

  private initPlayer(): void {
    const player = new AIPlayer();
    const buildResources = player.getNonTransportableResources();
    const actionContext = this.actionContext;
    this.player = player;
    actionContext.player = player;
    actionContext.buildingFactory.setBuildResources(buildResources);
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
    this.addProcessor(new OverheadsSellingProcessor());
  }

  private setupEvents(): void {
    const pathfinder = this.world.getPathfinder();
    pathfinder.on(PathfinderEventType.ConnectedBuildings, this.onConnectedBuildings, this);
    pathfinder.on(PathfinderEventType.ConnectedRelatedBuildings, this.onConnectedRelatedBuildings, this);
    pathfinder.on(PathfinderEventType.ConnectedBuildingToStorage, this.onConnectedBuildingToStorage, this);
    pathfinder.on(PathfinderEventType.ConnectedToConveyor, this.onConnectedToConveyor, this);
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

    processor.on(ProcessingEventType.SellOverhead, this.onOverheadSold, this);
    processor.on(ProcessingEventType.SellResource, this.onResourceSold, this);
  }

  private tick(): void {
    this.preUpdate();
    this.preProcess();
    this.processPlayer();
    this.postProcess();
    this.postUpdate();
    // console.log(this.player.getNonTransportableResources().toString());
    // console.warn(this.world.getBuildingAt(4, 5).getResources().toString());
    // console.warn(this.world.getBuildingAt(7, 5).getResources().toString());
    // console.warn(this.world.getBuildingAt(4, 7).getResources().toString());
    // console.warn(this.world.getBuildingAt(5, 7).getResources().toString());
  }

  private preUpdate(): void {
    this.karma.preUpdate();
  }

  private preProcess(): void {
    this.preprocessors.forEach(this.executeProcessor, this);
  }

  private postProcess(): void {
    this.postprocessors.forEach(this.executeProcessor, this);
  }

  private postUpdate(): void {
    const player = this.player;
    const karmaController = this.karmaController;
    const pathfinder = this.world.getPathfinder();
    pathfinder.update();
    karmaController.processPathfinder(pathfinder);
    karmaController.processPlayerResources(player.getNonTransportableResources());
    player.postUpdate();
    this.updateHUD();
  }

  private processPlayer(): void {
    const action = this.player.act();

    if (GameConfig.DebugActions) {
      console.log(`Executing player's action: ${action}`);
    }

    action.setContext(this.actionContext);
    action.execute();
  }

  private executeProcessor(processor: WorldProcessor): void {
    processor.process();
  }

  private updateHUD(): void {
    this.hud
      .updateResources(this.player.getNonTransportableResources())
      .updateKarma(this.karma.summarize());
  }

  private onOverheadSold(): void {
    this.karmaController.processOverheadSold();
  }

  private onResourceSold(income: number): void {
    this.karmaController.processResourceSold(income);
  }

  private onConnectedBuildings(): void {
    this.karmaController.processConnectedBuildings();
  }

  private onConnectedRelatedBuildings(): void {
    this.karmaController.processConnectedRelatedBuildings();
  }

  private onConnectedBuildingToStorage(): void {
    this.karmaController.processConnectedBuildingToStorage();
  }

  private onConnectedToConveyor(): void {
    this.karmaController.processConnectedToConveyor();
  }
}
