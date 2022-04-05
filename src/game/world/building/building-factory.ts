import Building from './building';
import BuildingSettings from './building-settings';
import BuildingType from './building-type.enum';
import BuildingView from './building-view';

export default class BuildingFactory {
  private scene: Scene;
  private settingsLookup: Record<BuildingType, BuildingSettings> = <any>{};

  constructor(scene: Scene) {
    this.scene = scene;

    this.setupSettings();
  }

  public create(type: BuildingType): Building {
    const settings = this.settingsLookup[type];
    const building = new Building();
    building.setView(new BuildingView(this.scene, settings));
    return building;
  }

  private setupSettings(): void {
    const settings = [
      new BuildingSettings({
        name: 'Oil Refinery',
        key: 'refinery_oil',
        type: BuildingType.OilRefinery,
      }),
      new BuildingSettings({
        name: 'Oil Derrick',
        key: 'derrick_oil',
        type: BuildingType.OilDerrick,
      }),
    ];

    settings.forEach((setting) => this.addSetting(setting));
  }

  private addSetting(setting: BuildingSettings): void {
    this.settingsLookup[setting.type] = setting;
  }
}
