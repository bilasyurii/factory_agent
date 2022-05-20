export default class ObjectUtils {
  private constructor() { }

  public static copy(from: any, to: any): void {
    for (const key in from) {
      if (Object.prototype.hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }
  }

  public static enumToArray<T>(object: any): T[] {
    const arr: T[] = [];

    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        arr.push(key as any as T);
      }
    }

    return arr;
  }

  public static forInEnum<T>(object: any, callback: (key: T) => void, ctx?: any): void {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        callback.call(ctx, (<T><any>key));
      }
    }
  }

  public static forInObject<K, V>(object: any, callback: (key: K, value: V) => void, ctx?: any): void {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        callback.call(ctx, (<K><any>key), (<V><any>object[key]));
      }
    }
  }
}
