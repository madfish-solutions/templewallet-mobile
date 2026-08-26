import { createAction } from '@reduxjs/toolkit';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';

interface ProcessLoadedEvmAssetsActionPayload {
  account: HexString;
  chainId: number;
  assets: Record<string, { standard: EvmAssetStandardEnum }>;
}

export const processLoadedEvmAssetsAction = createAction<ProcessLoadedEvmAssetsActionPayload>(
  'evm/assets/PROCESS_LOADED_EVM_ASSETS'
);

interface SetEvmAssetManualActionPayload {
  account: HexString;
  chainId: number;
  slug: string;
  manual: boolean;
  /** Applied only when the entry is created by this action; existing entries keep their standard */
  standard?: EvmAssetStandardEnum;
}

export const setEvmAssetManualAction = createAction<SetEvmAssetManualActionPayload>('evm/assets/SET_EVM_ASSET_MANUAL');

interface SetEvmAssetVisibilityActionPayload {
  account: HexString;
  chainId: number;
  slug: string;
  visibility: VisibilityEnum;
}

export const setEvmAssetVisibilityAction = createAction<SetEvmAssetVisibilityActionPayload>(
  'evm/assets/SET_EVM_ASSET_VISIBILITY'
);
