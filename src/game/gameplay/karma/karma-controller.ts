import MathUtils from "../../../utils/math-utils";
import Pathfinder from "../../world/grid/pathfinding/pathfinder";
import ResourceBunch from "../../world/resource/resource-bunch";
import ResourceType from "../../world/resource/resource-type.enum";
import Karma from "./karma";
import KarmaItem from "./karma-item";

export default class KarmaController {
  private karma: Karma;
  private prevMoney: number;
  private prevEnergy: number;

  constructor(karma: Karma) {
    this.karma = karma;
  }

  public reset(): void {
    this.prevMoney = 0;
    this.prevEnergy = 0;
    this.karma.reset();
  }

  public processPathfinder(pathfinder: Pathfinder): void {
    const previousPathsData = pathfinder.getPreviousPathsData();

    if (previousPathsData) {
      const prevPathsAnalytics = pathfinder.analyzePathsData(previousPathsData);
      const newPathsAnalytics = pathfinder.analyzePathsData(pathfinder.getPaths());
      const missingPathsDifference = newPathsAnalytics.missingPathsCount - prevPathsAnalytics.missingPathsCount;

      if (missingPathsDifference > 0) {
        this.karma.addItem(new KarmaItem('MissingPaths', 1, -MathUtils.normalizeLogarithmic(missingPathsDifference, 1, 2)))
      }
    }
  }

  public processWrongDestroy(): void {
    this.karma.addItem(new KarmaItem('WrongDestroy', 1, -1));
  }

  public processWrongBuild(): void {
    this.karma.addItem(new KarmaItem('WrongBuild', 1, -1));
  }

  public processDuplicateBuild(): void {
    this.karma.addItem(new KarmaItem('DuplicateBuild', 5, -1));
  }

  public processPlayerResources(resources: ResourceBunch): void {
    const money = resources.getAmount(ResourceType.Money);
    const energy = resources.getAmount(ResourceType.Energy);
    const moneyDiff = money - this.prevMoney;
    const energyDiff = energy - this.prevEnergy;
    this.prevMoney = money;
    this.prevEnergy = energy;
    this.getOrCreatePersistent('MoneyIncome', 10).value = MathUtils.normalizeLogarithmicSigned(moneyDiff, 5, 5);
    this.getOrCreatePersistent('EnergyIncome', 3).value = MathUtils.normalizeLogarithmicSigned(energyDiff, 5, 5);
  }

  public processOverheadSold(): void {
    this.karma.addItem(new KarmaItem('OverheadSold', 3, 1, 5));
  }

  public processResourceSold(income: number): void {
    this.karma.addItem(new KarmaItem('ResourceSold', 2, 0.7 + 0.3 * MathUtils.normalizeLogarithmic(income, 10, 5)));
  }

  public processConnectedBuildings(): void {
    this.karma.addItem(new KarmaItem('ConnectedBuildings', 1, 1));
  }

  public processConnectedRelatedBuildings(): void {
    this.karma.addItem(new KarmaItem('ConnectedRelatedBuildings', 4, 1));
  }

  public processConnectedBuildingToStorage(): void {
    this.karma.addItem(new KarmaItem('ConnectedBuildingToStorage', 4, 1));
  }

  public processConnectedToConveyor(): void {
    this.karma.addItem(new KarmaItem('ConnectedToConveyor', 2, 1));
  }

  private getOrCreatePersistent(name: string, weight: number = 1): KarmaItem {
    const karma = this.karma;
    let item = karma.getPersistentByName(name);

    if (!item) {
      item = new KarmaItem(name, weight, 1, Infinity);
      karma.addItem(item);
    }

    return item;
  }
}
