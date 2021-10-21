import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { TokenMetadataResponse } from '../../utils/token-metadata.utils';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface tokenWhitelistEntry {
  network: string;
  type: string;
  contractAddress: string;
  fa2TokenId?: number;
  metadata: Pick<TokenMetadataInterface, 'decimals' | 'name' | 'symbol' | 'thumbnailUri'>;
}

export interface SwapState {
  tokenWhitelist: LoadableEntityState<TokenMetadataResponse[]>;
}

export const swapInitialState: SwapState = {
  tokenWhitelist: createEntity(Object.assign({}))
};

export interface SwapRootState {
  swap: SwapState;
}
