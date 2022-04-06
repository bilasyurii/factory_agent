import Player from "./player";
import PlayerAction from "./actions/player-action";
import DoNothingAction from "./actions/do-nothing-action";

export default class AIPlayer extends Player {
  constructor() {
    super();
  }

  public act(): PlayerAction {
    return new DoNothingAction();
  }
}
