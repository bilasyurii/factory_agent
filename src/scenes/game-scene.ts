import GameContainer from '../game/game-container';
import HUD from '../game/ui/hud';

export default class GameScene extends Phaser.Scene {
  private hud: HUD;

  constructor() {
    super({
      key: 'game',
    });
  }

  public create(): void {
    this.initHUD();
    this.initGameContainer();
    this.children.bringToTop(this.hud);
  }

  private initHUD(): void {
    this.hud = this.add.existing(new HUD(this));
  }

  private initGameContainer(): void {
    this.add.existing(new GameContainer(this, this.hud))
  }
}