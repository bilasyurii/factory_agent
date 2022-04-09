import Player from './player.abstract';
import PlayerAction from './actions/player-action.abstract';
import BuildAction from './actions/build-action';
import BuildingType from '../../world/building/building-type.enum';

export default class AIPlayer extends Player {
  constructor() {
    super();
  }

  public act(): PlayerAction {
    return new BuildAction(BuildingType.Conveyor, ~~(Math.random() * 10), ~~(Math.random() * 10));
  }
}
