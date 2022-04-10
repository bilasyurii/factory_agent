import Player from './player.abstract';
import PlayerAction from './actions/player-action.abstract';
import BuildAction from './actions/build-action';
import BuildingType from '../../world/building/building-type.enum';
import DoNothingAction from './actions/do-nothing-action';

export default class AIPlayer extends Player {
  constructor() {
    super();
  }

  public act(): PlayerAction {
    return new DoNothingAction();
    return new BuildAction(BuildingType.Conveyor, ~~(Math.random() * 10), ~~(Math.random() * 10));
  }
}
