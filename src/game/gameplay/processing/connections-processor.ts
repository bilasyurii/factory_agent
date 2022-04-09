import Building from '../../world/building/building';
import BuildingType from '../../world/building/building-type.enum';
import ProcessorType from './processor-type.enum';
import WorldProcessor from './world-processor';

interface IConnection {
  key: string;
  direction: Vector2;
}

export default class ConnectionsProcessor extends WorldProcessor {
  private connections: IConnection[] = [];

  constructor() {
    super(ProcessorType.Postprocessor);

    this.initConnections();
  }

  public process(): void {
    this.iterate(this.updateConveyorConnections);
  }

  private initConnections(): void {
    this.connections = [
      {
        key: 'up',
        direction: Phaser.Math.Vector2.UP.clone(),
      },
      {
        key: 'right',
        direction: Phaser.Math.Vector2.RIGHT.clone(),
      },
      {
        key: 'down',
        direction: Phaser.Math.Vector2.DOWN.clone(),
      },
      {
        key: 'left',
        direction: Phaser.Math.Vector2.LEFT.clone(),
      },
    ];
  }

  private updateConveyorConnections(building: Building): void {
    const type = building.getType();

    if (type !== BuildingType.Conveyor) {
      return;
    }

    const world = this.world;

    const x = building.getX();
    const y = building.getY();

    const connections = this.connections;
    const count = connections.length;

    let name = '';

    for (let i = 0; i < count; ++i) {
      const connection = connections[i];
      const offset = connection.direction;
      const neighborX = x + offset.x;
      const neighborY = y + offset.y;
      const neighbor = world.getBuildingAt(neighborX, neighborY);

      if (!neighbor) {
        continue;
      }

      name += '_' + connection.key;
    }

    if (name === '') {
      name = 'conveyor_none';
    } else {
      name = 'conveyor' + name;
    }

    const view = building.getView();
    view.setTexture(name);
  }
}
