import Player from './player.abstract';
import PlayerAction from './actions/player-action.abstract';
import DoNothingAction from './actions/do-nothing-action';
import BuildAction from './actions/build-action';
import BuildingType from '../../world/building/building-type.enum';

export default class AIPlayer extends Player {
  constructor() {
    super();
  }

  public act(): PlayerAction {
    return new BuildAction(BuildingType.OilRefinery, 3, 2);
    return new DoNothingAction();
  }
}
