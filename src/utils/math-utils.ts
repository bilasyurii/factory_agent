export default class MathUtils {
  private constructor() { }

  public static normalizeLogarithmic(value: number, multiplier: number, logBase: number) {
    const raw = value / multiplier;
    const log = Math.log(raw) / Math.log(logBase);

    if (log <= 1) {
      return 0.5 * (raw / logBase);
    } else {
      const decrement = 1 / Math.pow(2, log);
      return 1 - decrement;
    }
  }
}
