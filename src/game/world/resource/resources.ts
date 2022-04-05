import Resource from './resource"
import ResourceType from './resource-type.enum"

export default class Resources {
  private static inited: boolean = false;
  private static lookup: Record<ResourceType, Resource> = <any>{};

  private constructor() {}

  public static get(type: ResourceType): Resource {
    return Resources.lookup[type];
  }

  public static init(): void {
    if (Resources.inited) {
      return;
    }

    const resources = [
      new Resource({
        name: 'Money',
        type: ResourceType.Money,
      }),
      new Resource({
        name: 'Energy',
        type: ResourceType.Energy,
      }),
      new Resource({
        name: 'Coal',
        type: ResourceType.Coal,
      }),
      new Resource({
        name: 'IronOre',
        type: ResourceType.IronOre,
      }),
      new Resource({
        name: 'Oil',
        type: ResourceType.Oil,
      }),
      new Resource({
        name: 'Fuel',
        type: ResourceType.Fuel,
      }),
      new Resource({
        name: 'Plastic',
        type: ResourceType.Plastic,
      }),
      new Resource({
        name: 'Metal',
        type: ResourceType.Metal,
      }),
      new Resource({
        name: 'Water',
        type: ResourceType.Water,
      }),
      new Resource({
        name: 'Heat',
        type: ResourceType.Heat,
      }),
      new Resource({
        name: 'Tools',
        type: ResourceType.Tools,
      }),
      new Resource({
        name: 'Cars',
        type: ResourceType.Cars,
      }),
      new Resource({
        name: 'Toys',
        type: ResourceType.Toys,
      }),
    ];

    resources.forEach((resource) => Resources.register(resource));

    Resources.inited = true;
  }

  private static register(resource: Resource): void {
    Resources.lookup[resource.type] = resource;
  }
}

Resources.init();
