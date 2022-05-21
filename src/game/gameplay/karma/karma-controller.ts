import MathUtils from "../../../utils/math-utils";
import Pathfinder from "../../world/grid/pathfinding/pathfinder";
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
}
