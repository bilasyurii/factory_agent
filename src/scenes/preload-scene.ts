export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'preload',
    });
  }

  public preload(): void {
    const load = this.load;    

    load.setPath('assets/images/');
    load.image('phaser_logo', 'phaser_logo.png');

    load.on(Phaser.Loader.Events.COMPLETE, this.onAssetsLoaded, this);
  }

  private onAssetsLoaded(): void {
    this.scene.start('game');
  }
}
