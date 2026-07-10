import { useSelector } from '../../selector';

import { EvmChainAssetsRecord } from './evm-assets-state';

const EMPTY_EVM_CHAIN_ASSETS_RECORD: EvmChainAssetsRecord = {};

export const useEvmAccountChainAssetsSelector = (account: HexString, chainId: number): EvmChainAssetsRecord =>
  useSelector(({ evmAssets }) => evmAssets.record[account]?.[chainId]) ?? EMPTY_EVM_CHAIN_ASSETS_RECORD;
