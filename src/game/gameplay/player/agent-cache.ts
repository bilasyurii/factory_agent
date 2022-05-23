interface IAgentCache {
  snapshot: object;
  statesCount: number;
  actionsCount: number;
}

const AgentCache: IAgentCache = {
  snapshot: null,
  statesCount: null,
  actionsCount: null,
};

export default AgentCache;
