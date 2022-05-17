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
        maxProductionCount: 1,
        buildRequirements: [
          new SolidGroundRequirement(),
        ],
      }),
      new BuildingSettings({
        name: 'Oil Refinery',
        key: 'refinery_oil',
        type: BuildingType.OilRefinery,
        usage: <any>{
          [ResourceType.Oil]: 3,
          [ResourceType.Energy]: 1,
          [ResourceType.Money]: 5,
        },
        gain: <any>{
          [ResourceType.Fuel]: 1,
        },
        buildRequirements: [
          new SolidGroundRequirement(),
        ],
      }),
      new BuildingSettings({
        name: 'Plastic Refinery',
        key: 'refinery_plastic',
        type: BuildingType.PlasticRefinery,
        usage: <any>{
          [ResourceType.Oil]: 1,
          [ResourceType.Energy]: 3,
          [ResourceType.Money]: 10,
        },
        gain: <any>{
          [ResourceType.Plastic]: 1,
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
          [ResourceType.Money]: 5,
          [ResourceType.Energy]: 1,
        },
        gain: <any>{
          [ResourceType.Oil]: 1,
        },
        buildRequirements: [
          new SolidGroundRequirement(),
        ],
      }),
      new BuildingSettings({
        name: 'Storage',
        key: 'storage',
        type: BuildingType.Storage,
        usage: <any>{
          [ResourceType.Money]: 1,
        },
        maxProductionCount: 1,
        gain: <any>{},
        buildRequirements: [
          new SolidGroundRequirement(),
        ],
      }),
      new BuildingSettings({
        name: 'Coal Mine',
        key: 'mine_coal',
        type: BuildingType.CoalMine,
        usage: <any>{
          [ResourceType.Money]: 5,
          [ResourceType.Energy]: 1,
        },
        gain: <any>{
          [ResourceType.Coal]: 1,
        },
        buildRequirements: [
          new SolidGroundRequirement(),
        ],
      }),
      new BuildingSettings({
        name: 'Iron Mine',
        key: 'mine_iron',
        type: BuildingType.IronMine,
        usage: <any>{
          [ResourceType.Money]: 5,
          [ResourceType.Energy]: 1,
        },
        gain: <any>{
          [ResourceType.IronOre]: 1,
        },
        buildRequirements: [
          new SolidGroundRequirement(),
        ],
      }),
      new BuildingSettings({
        name: 'Furnace',
        key: 'furnace',
        type: BuildingType.Furnace,
        usage: <any>{
          [ResourceType.Energy]: 1,
          [ResourceType.Money]: 2,
          [ResourceType.IronOre]: 1,
          [ResourceType.Coal]: 2,
        },
        gain: <any>{
          [ResourceType.Metal]: 2,
        },
        buildRequirements: [
          new SolidGroundRequirement(),
        ],
      }),
      new BuildingSettings({
        name: 'Tools Assembly',
        key: 'assembly_tools',
        type: BuildingType.ToolsAssembly,
        usage: <any>{
          [ResourceType.Money]: 10,
          [ResourceType.Energy]: 10,
          [ResourceType.Metal]: 2,
        },
        gain: <any>{
          [ResourceType.Tools]: 2,
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
