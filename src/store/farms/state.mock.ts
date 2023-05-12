import { FarmVersionEnum } from 'src/apis/quipuswap/types';

import { createEntity } from '../create-entity';
import { FarmsState } from './state';

export const mockFarmsState: FarmsState = {
  farms: createEntity({ list: [] }),
  lastStakes: {
    [FarmVersionEnum.V3]: {},
    [FarmVersionEnum.V2]: {},
    [FarmVersionEnum.V1]: {}
  }
};
