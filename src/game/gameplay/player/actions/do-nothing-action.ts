import PlayerAction from './player-action';
import PlayerActionType from './player-action-type.enum';

export default class DoNothingAction extends PlayerAction {
  constructor() {
    super(PlayerActionType.DoNothing);
  }

  public execute(): void { }
}