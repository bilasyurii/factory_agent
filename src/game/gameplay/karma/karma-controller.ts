import MathUtils from "../../../utils/math-utils";
import Pathfinder from "../../world/grid/pathfinding/pathfinder";
import ResourceBunch from "../../world/resource/resource-bunch";
import ResourceType from "../../world/resource/resource-type.enum";
import Karma from "./karma";
import KarmaItem from "./karma-item";

export default class KarmaController {
  private karma: Karma;

  constructor(karma: Karma) {
    this.karma = karma;
  }

  public processPathfinder(pathfinder: Pathfinder): void {
    const previousPathsData = pathfinder.getPreviousPathsData();

    if (previousPathsData) {
      const prevPathsAnalytics = pathfinder.analyzePathsData(previousPathsData);
      const newPathsAnalytics = pathfinder.analyzePathsData(pathfinder.getPaths());
      const missingPathsDifference = newPathsAnalytics.missingPathsCount - prevPathsAnalytics.missingPathsCount;
      this.karma.addItem(new KarmaItem('MissingPaths', 1, 1 - MathUtils.normalizeLogarithmic(missingPathsDifference, 1, 2)))
    }
  }

  public processWrongDestroy(): void {
    this.karma.addItem(new KarmaItem('WrongDestroy', 1, 0));
  }

  public processWrongBuild(): void {
    this.karma.addItem(new KarmaItem('WrongBuild', 1, 0));
  }

  public processPlayerResources(resources: ResourceBunch): void {
    this.getOrCreatePersistent('Energy', 3).value = MathUtils.normalizeLogarithmic(resources.getAmount(ResourceType.Energy), 100, 10);
    this.getOrCreatePersistent('Money', 10).value = MathUtils.normalizeLogarithmic(resources.getAmount(ResourceType.Money), 100, 10);
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
