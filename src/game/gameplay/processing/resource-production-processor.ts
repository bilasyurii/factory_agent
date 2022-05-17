import ObjectUtils from '../../../utils/object-utils';
import Building from '../../world/building/building';
import ResourceType from '../../world/resource/resource-type.enum';
import Resources from '../../world/resource/resources';
import ResourceBunch from '../../world/resource/resource-bunch';
import ProcessorType from './processor-type.enum';
import WorldProcessor from './world-processor';
import GameConfig from '../../../config/game-config';

export default class ResourceProductionProcessor extends WorldProcessor {
  constructor() {
    super(ProcessorType.Preprocessor);
  }

  public process(): void {
    this.iterate(this.processBuilding);
  }

  private static getResources(resourceType: ResourceType, buildingResources: ResourceBunch, playerResources: ResourceBunch): ResourceBunch {
    return Resources.get(resourceType).transportable ? buildingResources : playerResources;
  }

  private processBuilding(building: Building): void {
    const productionCount = this.getProductionCount(building);

    if (productionCount !== 0) {
      this.produce(building, productionCount);
    }
  }

  private getProductionCount(building: Building): number {
    const settings = building.getSettings();
    const buildingResources = building.getResources();

    let maxProductionCount = Infinity;

    ObjectUtils.forInEnum<ResourceType>(ResourceType, function (resourceType) {
      if (maxProductionCount === 0) {
        return;
      }

      const usage = settings.getUsage(resourceType);

      if (usage <= 0) {
        return;
      }

      const available = buildingResources.getAmount(resourceType);
      const productionCount = ~~(available / usage);

      if (productionCount >= 0 && productionCount < maxProductionCount) {
        maxProductionCount = productionCount;
      }
    });

    if (maxProductionCount === Infinity) {
      return 0;
    }

    return Math.min(settings.maxProductionCount, maxProductionCount);
  }

  private produce(building: Building, productionCount: number): void {
    const settings = building.getSettings();
    const buildingResources = building.getResources();
    const playerNonTransportableResources = this.player.getNonTransportableResources();

    ObjectUtils.forInEnum<ResourceType>(ResourceType, function (resourceType) {
      let usage = settings.getUsage(resourceType);
      let gain = settings.getGain(resourceType);
      
      if (gain !== 0) {
        const resources = ResourceProductionProcessor.getResources(resourceType, buildingResources, playerNonTransportableResources);
        resources.addAmount(resourceType, gain * productionCount);

        if (GameConfig.DebugProduction) {
          console.log(`Produced ${gain}x${productionCount}=${gain*productionCount} of ${resourceType} for ${building.getType() + '_' + building.id}`);
        }
      }

      if (usage !== 0) {
        buildingResources.subtractAmount(resourceType, usage * productionCount);

        if (GameConfig.DebugUsage) {
          console.log(`Used ${usage}x${productionCount}=${usage*productionCount} of ${resourceType} for ${building.getType() + '_' + building.id}`);
        }
      }
    });
  }
}
