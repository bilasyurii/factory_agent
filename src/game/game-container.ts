import GameConfig from '../config/game-config';

export default class GameContainer extends Phaser.GameObjects.Container {
  constructor(scene: Scene) {
    super(scene);

    this.initSprite();
    this.initGraphics();
    this.initText();
  }

  private initSprite(): void {
    const sprite = this.scene.add.sprite(0, 0, 'phaser_logo');
    this.add(sprite);
    sprite.setPosition(GameConfig.Width * 0.5, GameConfig.Height * 0.5);
  }

  private initGraphics(): void {
    const graphics = this.scene.add.graphics();
    this.add(graphics);
    graphics.lineStyle(5, 0x00ffff);
    graphics.beginPath();
    graphics.moveTo(-250, -150);
    graphics.lineTo(250, -150);
    graphics.lineTo(0, 250);
    graphics.closePath();
    graphics.stroke();
    graphics.setPosition(GameConfig.Width * 0.5, GameConfig.Height * 0.5);
  }

  private initText(): void {
    const style = {
      color: 'yellow',
      fontSize: '24px',
    };
    const text = this.scene.make.text({
      text: `Phaser v${Phaser.VERSION}`,
      style,
    });
    this.add(text);
    text.setOrigin(1, 1);
    text.setPosition(
      GameConfig.Width - 15,
      GameConfig.Height - 15
    );
  }
}
