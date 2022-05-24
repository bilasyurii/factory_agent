interface IAgentCache {
  snapshotRequested: EventEmitter;
  snapshot: object;
  statesCount: number;
  actionsCount: number;
}

const AgentCache: IAgentCache = {
  snapshotRequested: new Phaser.Events.EventEmitter(),
  snapshot: null,
  statesCount: null,
  actionsCount: null,
};

export default AgentCache;
