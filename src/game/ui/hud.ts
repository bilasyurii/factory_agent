import ResourceBunch from "../world/resource/resource-bunch";
import ResourceType from "../world/resource/resource-type.enum";
import TextButton from "./button";
import HUDEventType from "./hud-event-type.enum";

export default class HUD extends Phaser.GameObjects.Container {
  private moneyText: PhaserText;
  private energyText: PhaserText;
  private karmaText: PhaserText;
  private importBtn: TextButton;
  private exportBtn: TextButton;

  constructor(scene: Scene) {
    super(scene);

    this.initStatTexts();
    this.initImportExportButtons();
    this.setupEvents();
  }

  public updateResources(playerResources: ResourceBunch): this {
    this.moneyText.setText(playerResources.getAmount(ResourceType.Money) + ' : Money');
    this.energyText.setText(playerResources.getAmount(ResourceType.Energy) + ' : Energy');
    return this;
  }

  public updateKarma(value: number): this {
    this.karmaText.setText(value.toFixed(2) + ' : Karma');
    return this;
  }

  private initStatTexts(): void {
    this.moneyText = this.createText(new Phaser.Math.Vector2(850, 50));
    this.energyText = this.createText(new Phaser.Math.Vector2(850, 100));
    this.karmaText = this.createText(new Phaser.Math.Vector2(850, 150));
  }

  private initImportExportButtons(): void {
    this.importBtn = this.createBtn('Import', new Phaser.Math.Vector2(775, 200));
    this.exportBtn = this.createBtn('Export', new Phaser.Math.Vector2(775, 250));
  }

  private setupEvents(): void {
    this.importBtn.on('pointerdown', () => this.emit(HUDEventType.ImportPressed), this);
    this.exportBtn.on('pointerdown', () => this.emit(HUDEventType.ExportPressed), this);
  }

  private createText(position: Vector2): PhaserText {
    const text = new Phaser.GameObjects.Text(this.scene, position.x, position.y, 'test', {
      align: 'right',
      color: '#ffff00',
      fontFamily: 'Arial',
      fontSize: '20pt',
    });
    this.add(text);
    text.setOrigin(1, 0.5);
    return text;
  }

  private createBtn(text: string, position: Vector2): TextButton {
    const btn = new TextButton(this.scene, text);
    this.add(btn);
    btn.copyPosition(position);
    return btn;
  }
}
