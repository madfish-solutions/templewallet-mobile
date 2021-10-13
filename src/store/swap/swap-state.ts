import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface tokenWhitelistEntry {
  network: string;
  type: string;
  contractAddress: string;
  fa2TokenAddress?: number;
  metadata: Pick<TokenMetadataInterface, 'decimals' | 'name' | 'symbol' | 'thumbnailUri'>;
}

export interface SwapState {
  tokenWhitelist: LoadableEntityState<tokenWhitelistEntry[]>;
}

export const swapInitialState: SwapState = {
  tokenWhitelist: createEntity(Object.assign({}))
};

export interface SwapRootState {
  swap: SwapState;
}
