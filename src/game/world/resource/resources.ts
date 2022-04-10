import Resource from './resource';
import ResourceType from './resource-type.enum';

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
        transportable: false,
      }),
      new Resource({
        name: 'Energy',
        type: ResourceType.Energy,
        transportable: false,
      }),
      new Resource({
        name: 'Coal',
        type: ResourceType.Coal,
        transportable: true,
      }),
      new Resource({
        name: 'Iron ore',
        type: ResourceType.IronOre,
        transportable: true,
      }),
      new Resource({
        name: 'Oil',
        type: ResourceType.Oil,
        transportable: true,
      }),
      new Resource({
        name: 'Fuel',
        type: ResourceType.Fuel,
        transportable: true,
      }),
      new Resource({
        name: 'Plastic',
        type: ResourceType.Plastic,
        transportable: true,
      }),
      new Resource({
        name: 'Metal',
        type: ResourceType.Metal,
        transportable: true,
      }),
      new Resource({
        name: 'Water',
        type: ResourceType.Water,
        transportable: true,
      }),
      new Resource({
        name: 'Heat',
        type: ResourceType.Heat,
        transportable: true,
      }),
      new Resource({
        name: 'Tools',
        type: ResourceType.Tools,
        transportable: true,
      }),
      new Resource({
        name: 'Cars',
        type: ResourceType.Cars,
        transportable: true,
      }),
      new Resource({
        name: 'Toys',
        type: ResourceType.Toys,
        transportable: true,
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
