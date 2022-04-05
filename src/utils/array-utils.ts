export default class ArrayUtils {
  private constructor() { }

  public static removeFirst<T>(array: T[], value: T): boolean {
    const count = array.length;

    for (let i = 0; i < count; ++i) {
      if (array[i] === value) {
        array.splice(i, 1);
        return true;
      }
    }

    return false;
  }
}
