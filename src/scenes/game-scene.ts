import GameContainer from '../game/game-container';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'game',
    });
  }

  public create(): void {
    this.initGameContainer();
  }

  private initGameContainer(): void {
    this.add.existing(new GameContainer(this))
  }
}