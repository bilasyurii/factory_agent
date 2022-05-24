export default class TextButton extends Phaser.GameObjects.Text {
  constructor(scene: Scene, text: string) {
    super(scene, 0, 0, text, {
      align: 'center',
      color: 'green',
      fontFamily: 'Arial',
      fontSize: '20pt',
    });

    this.setOrigin(0.5);
    this.setInteractive();

    this.on('pointerover', () => this.setColor('lightgreen'));
    this.on('pointerout', () => this.setColor('green'));
  }
}
