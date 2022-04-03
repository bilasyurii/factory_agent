import GameConfig from '../../config/game-config';

export function TilePos(value: number): number {
  return (value + 0.5) * GameConfig.TileSize;
}
