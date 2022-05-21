import Player from './player.abstract';
import PlayerAction from './actions/player-action.abstract';
import BuildAction from './actions/build-action';
import BuildingType from '../../world/building/building-type.enum';
import DoNothingAction from './actions/do-nothing-action';
import RL from '../../learning/rl';
import ObjectUtils from '../../../utils/object-utils';
import World from '../../world/world';
import ResourceType from '../../world/resource/resource-type.enum';
import DestroyAction from './actions/destroy-action';
import Karma from '../karma/karma';

const BUILDING_TYPES = ObjectUtils.enumToArray<BuildingType>(BuildingType);
const BUILDING_TYPES_COUNT = BUILDING_TYPES.length;

export default class AIPlayer extends Player {
  private agent: RL.DQNAgent = null;
  private statesCount: number;
  private doNothingActions: number;
  private buildActions: number;
  private destroyActions: number;
  private actionsCount: number;

  constructor() {
    super();
  }

  public init(world: World, karma: Karma): void {
    super.init(world, karma);
    this.initEnvironmentSettings();
    this.initAgent();
  }

  public act(): PlayerAction {
    const environmentState = this.readEnvironmentState();
    const actionCode = this.agent.act(environmentState);
    return this.parseAction(actionCode);
  }

  public postUpdate(): void {
    this.agent.learn(this.karma.summarize());
  }

  private initEnvironmentSettings(): void {
    const worldWidth = this.worldWidth;
    const worldHeight = this.worldHeight;
    const tiles = worldWidth * worldHeight;
    const states = tiles + 2; // 1 extra state for money & 1 extra state for energy
    const buildActions = tiles * BUILDING_TYPES_COUNT;
    const destroyActions = tiles;
    const actions = buildActions + destroyActions + 1; // 1 extra action for doing nothing

    this.statesCount = states;
    this.doNothingActions = 1;
    this.buildActions = buildActions;
    this.destroyActions = destroyActions;
    this.actionsCount = actions;
  }

  private initAgent(): void {
    const states = this.statesCount;
    const actions = this.actionsCount;
    const environment: RL.IEnvironment = {
      getNumStates: function () { return states; },
      getMaxNumActions: function () { return actions; },
    };
    this.agent = new RL.DQNAgent(environment, {
      gamma: 0.5,
      epsilon: 0.05,
      alpha: 0.01,
      experience_add_every: 1,
      experience_size: 20000,
      learning_steps_per_iteration: 20,
    });
  }

  private readEnvironmentState(): RL.EnvironmentState {
    const width = this.worldWidth;
    const height = this.worldHeight;
    const world = this.world;
    const environmentState = [];

    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        const building = world.getBuildingAt(x, y);
        environmentState.push((building ? BUILDING_TYPES.indexOf(building.getType()) + 1 : 0))
      }
    }

    const resources = this.nonTransportableResources;
    environmentState.push(resources.getAmount(ResourceType.Money));
    environmentState.push(resources.getAmount(ResourceType.Energy));
    return environmentState;
  }

  private parseAction(action: number): PlayerAction {
    let checkActionsCount: number;
    checkActionsCount = this.doNothingActions;

    if (action < checkActionsCount) {
      return new DoNothingAction();
    }

    const width = this.worldWidth;

    action -= checkActionsCount;
    checkActionsCount = this.destroyActions;

    if (action < checkActionsCount) {
      const y = ~~(action / width);
      const x = action % width;
      return new DestroyAction(x, y);
    }

    action -= checkActionsCount;
    checkActionsCount = this.buildActions;

    if (action < checkActionsCount) {
      const buildingTypeIndex = action % BUILDING_TYPES_COUNT;
      const buildingType = BUILDING_TYPES[buildingTypeIndex];
      const xy = ~~(action / BUILDING_TYPES_COUNT);
      const y = ~~(xy / width);
      const x = xy % width;
      return new BuildAction(buildingType, x, y);
    }

    throw new Error('Wrong action code' + action);
  }
}
