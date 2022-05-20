import PlayerAction from './player-action.abstract';
import PlayerActionType from './player-action-type.enum';

export default class DoNothingAction extends PlayerAction {
  constructor() {
    super(PlayerActionType.DoNothing);
  }

  public execute(): void { }

  public toString(): string {
    return 'Do nothing';
  }
}
