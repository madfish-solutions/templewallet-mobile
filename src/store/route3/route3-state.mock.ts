import { createEntity } from '../create-entity';
import { Route3State } from './route3-state';

export const mockRoute3State: Route3State = {
  dexes: createEntity([]),
  tokens: createEntity([]),
  swapParams: createEntity({ input: 0, output: 0, chains: [] })
};
