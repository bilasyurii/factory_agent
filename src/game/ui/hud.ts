import ResourceBunch from "../world/resource/resource-bunch";
import ResourceType from "../world/resource/resource-type.enum";

export default class HUD extends Phaser.GameObjects.Container {
  private moneyText: PhaserText;
  private energyText: PhaserText;

  constructor(scene: Scene) {
    super(scene);

    this.initResourceTexts();
  }

  public updateResources(playerResources: ResourceBunch): void {
    this.moneyText.setText(playerResources.getAmount(ResourceType.Money) + ' : Money');
    this.energyText.setText(playerResources.getAmount(ResourceType.Energy) + ' : Energy');
  }

  private initResourceTexts(): void {
    this.moneyText = this.createText(new Phaser.Math.Vector2(850, 50));
    this.energyText = this.createText(new Phaser.Math.Vector2(850, 100));
  }

  private createText(position: Vector2): PhaserText {
    const text = new Phaser.GameObjects.Text(this.scene, position.x, position.y, 'test', {
      align: 'right',
      color: '#ffff00',
      fontFamily: 'Arial',
      fontSize: '30pt',
    });
    this.add(text);
    text.setOrigin(1, 0.5);
    return text;
  }
}
