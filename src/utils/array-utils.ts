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

  public static initArray<T>(width: number, height: number, value: T): T[][] {
    const arr: T[][] = [];

    for (let y = 0; y < height; ++y) {
      const row: T[] = [];
      arr.push(row);

      for (let x = 0; x < width; ++x) {
        row.push(value);
      }
    }

    return arr;
  }

  public static fillArray2d(array: any[][], value: any): void {
    const height = array.length;

    for (let y = 0; y < height; ++y) {
      const row = array[y];
      const width = row.length;
  
      for (let x = 0; x < width; ++x) {
        row[x] = value;
      }
    }
  }

  public static cloneArray2d<T>(array: T[][]): T[][] {
    const clone: T[][] = [];
    const height = array.length;

    for (let y = 0; y < height; ++y) {
      const row = array[y];
      const width = row.length;
      const cloneRow: T[] = [];
      clone.push(cloneRow);

      for (let x = 0; x < width; ++x) {
        cloneRow.push(row[x]);
      }
    }

    return clone;
  }
}
