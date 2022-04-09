import ResourceType from '../resource/resource-type.enum';
import Tile from '../tiles/tile';
import Building from './building';
import BuildingSettings from './building-settings';
import BuildingType from './building-type.enum';
import BuildingView from './building-view';
import SolidGroundRequirement from './requirements/solid-ground-requirement';

export default class BuildingFactory {
  private scene: Scene;
  private settingsLookup: Record<BuildingType, BuildingSettings> = <any>{};

  constructor(scene: Scene) {
    this.scene = scene;

    this.setupSettings();
  }

  public create(type: BuildingType, tile: Tile): Building | null {
    const settings = this.settingsLookup[type];
    const building = new Building(settings);

    if (settings.checkBuildRequirements(building, tile)) {
      building.setView(new BuildingView(this.scene, settings));
      return building;
    }

    return null;
  }

  private setupSettings(): void {
    const settings = [
      new BuildingSettings({
        name: 'Conveyor',
        key: 'conveyor_none',
        type: BuildingType.Conveyor,
        usage: <any>{
          [ResourceType.Energy]: 1,
          [ResourceType.Money]: 1,
        },
        gain: <any>{
        },
        buildRequirements: [
          new SolidGroundRequirement(),
        ],
      }),
      new BuildingSettings({
        name: 'Oil Refinery',
        key: 'refinery_oil',
        type: BuildingType.OilRefinery,
        usage: <any>{
          [ResourceType.Oil]: 1,
          [ResourceType.Energy]: 1,
          [ResourceType.Money]: 1,
        },
        gain: <any>{
          [ResourceType.Fuel]: 1,
        },
        buildRequirements: [
          new SolidGroundRequirement(),
        ],
      }),
      new BuildingSettings({
        name: 'Oil Derrick',
        key: 'derrick_oil',
        type: BuildingType.OilDerrick,
        usage: <any>{
          [ResourceType.Money]: 1,
        },
        gain: <any>{
          [ResourceType.Oil]: 1,
        },
        buildRequirements: [
          new SolidGroundRequirement(),
        ],
      }),
    ];

    settings.forEach((setting) => this.addSetting(setting));
  }

  private addSetting(setting: BuildingSettings): void {
    this.settingsLookup[setting.type] = setting;
  }
}
