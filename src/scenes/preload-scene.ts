export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'preload',
    });
  }

  public preload(): void {
    const load = this.load;

    this.loadFolder('assets/images/tiles/', [
      'platform',
      'grass',
      'water',
      'sand',
    ]);

    this.loadFolder('assets/images/buildings/', [
      'assembly_cars',
      'assembly_tools',
      'assembly_toys',
      'derrick',
      'furnace',
      'mine_coal',
      'mine_iron',
      'power_plant',
      'refinery_oil',
      'refinery_plastic',
      'storage',
      'turbine',
      'water_pump',
    ]);

    this.loadFolder('assets/images/conveyor/', [
      'conveyor_down',
      'conveyor_down_left',
      'conveyor_left',
      'conveyor_none',
      'conveyor_right',
      'conveyor_right_down',
      'conveyor_right_down_left',
      'conveyor_right_left',
      'conveyor_up',
      'conveyor_up_down',
      'conveyor_up_down_left',
      'conveyor_up_left',
      'conveyor_up_right',
      'conveyor_up_right_down',
      'conveyor_up_right_down_left',
      'conveyor_up_right_left',
    ]);

    load.on(Phaser.Loader.Events.COMPLETE, this.onAssetsLoaded, this);
  }

  private loadFolder(folderPath: string, keys: string[]) {
    const load = this.load;

    load.setPath(folderPath);

    keys.forEach((key) => {
      load.image(key, key + '.png');
    });
  }

  private onAssetsLoaded(): void {
    this.scene.start('game');
  }
}
