import PlayerAction from "./actions/player-action";

export default abstract class Player {
  constructor() {
  }

  public abstract act(): PlayerAction;
}
