import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { dispatch, store } from 'src/store';
import { mergeEvmAssetsAction } from 'src/store/evm/assets/evm-assets-actions';
import { evmAssetsPersistedReducer } from 'src/store/evm/assets/evm-assets-reducers';
import { processLoadedOnChainEvmBalances } from 'src/store/evm/balances/evm-balances-actions';
import { evmBalancesReducers } from 'src/store/evm/balances/evm-balances-reducers';
import { mockRootState } from 'src/store/root-state.mock';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { getViemPublicClient } from 'src/utils/rpc/evm-client.utils';

import { refreshSwapBalances } from './refresh-swap-balances';
import { SWAP_ERC20_ASSET, SWAP_NATIVE_ASSET, SWAP_OWNER, SWAP_TOKEN_ADDRESS } from './swap.mock';

jest.mock('src/store', () => ({ dispatch: jest.fn(), store: { getState: jest.fn() } }));
jest.mock('src/utils/rpc/evm-client.utils', () => ({ getViemPublicClient: jest.fn() }));

const network = { chainId: 42793, rpcBaseURL: 'https://rpc.example' };
const rpc = { getBalance: jest.fn(), readContract: jest.fn() };
const assets: ReturnType<typeof evmAssetsPersistedReducer> = {
  _persist: { version: 1, rehydrated: true },
  record: {
    [SWAP_OWNER]: {
      42793: {
        other: { standard: EvmAssetStandardEnum.ERC20, manual: false, visibility: VisibilityEnum.Hidden },
        manual: { standard: EvmAssetStandardEnum.ERC20, manual: true, visibility: VisibilityEnum.Visible }
      }
    }
  }
};
const state: ReturnType<typeof store.getState> = {
  ...mockRootState,
  _persist: { version: 1, rehydrated: true },
  evmAssets: assets,
  evmBalances: { record: { [SWAP_OWNER]: { 42793: { other: '123' } } }, timestamps: {} },
  wallet: {
    ...mockRootState.wallet,
    accounts: [
      {
        id: 'account',
        type: AccountTypeEnum.IMPORTED_CHAIN,
        chain: TempleChainKind.EVM,
        address: SWAP_OWNER,
        publicKey: '',
        name: 'Account'
      }
    ]
  }
};

describe('swap balance refresh', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(store.getState).mockReturnValue(state);
    jest.mocked(getViemPublicClient).mockReturnValue(rpc as unknown as ReturnType<typeof getViemPublicClient>);
    rpc.getBalance.mockResolvedValue(123n);
    rpc.readContract.mockResolvedValue(456n);
  });

  it('reads a destination token outside the account catalog and merges its assets', async () => {
    await refreshSwapBalances(network, 'account', SWAP_OWNER, SWAP_NATIVE_ASSET, SWAP_ERC20_ASSET);
    expect(rpc.readContract).toHaveBeenCalledWith(
      expect.objectContaining({ address: SWAP_TOKEN_ADDRESS, functionName: 'balanceOf', args: [SWAP_OWNER] })
    );
    const assetAction = jest
      .mocked(dispatch)
      .mock.calls.map(([action]) => action)
      .find(mergeEvmAssetsAction.match);
    expect(assetAction).toBeDefined();
    if (!assetAction) throw new Error('Missing asset merge');
    const merged = evmAssetsPersistedReducer(assets, assetAction);
    expect(merged.record[SWAP_OWNER][42793]).toMatchObject({
      other: assets.record[SWAP_OWNER][42793].other,
      manual: assets.record[SWAP_OWNER][42793].manual,
      [SWAP_TOKEN_ADDRESS]: { standard: EvmAssetStandardEnum.ERC20, manual: false, visibility: VisibilityEnum.Visible }
    });
  });

  it('retains unrelated balances and writes zero balances after a full spend', async () => {
    rpc.getBalance.mockResolvedValue(123n);
    rpc.readContract.mockResolvedValue(0n);
    await refreshSwapBalances(network, 'account', SWAP_OWNER, SWAP_ERC20_ASSET, SWAP_NATIVE_ASSET);
    const actions = jest.fn();
    const thunk = processLoadedOnChainEvmBalances({
      account: SWAP_OWNER,
      chainId: 42793,
      balances: { eth: '123', [SWAP_TOKEN_ADDRESS]: '0' },
      timestamp: Date.now()
    });
    expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
    thunk(actions, () => state, undefined);
    const refreshed = evmBalancesReducers(state.evmBalances, actions.mock.calls[0][0]);
    expect(refreshed.record[SWAP_OWNER][42793]).toEqual({ other: '123', eth: '123', [SWAP_TOKEN_ADDRESS]: '0' });
  });

  it('does not recreate an account after wallet reset or account removal', async () => {
    jest.mocked(store.getState).mockReturnValue({ ...state, wallet: { ...state.wallet, accounts: [] } });
    await refreshSwapBalances(network, 'account', SWAP_OWNER, SWAP_NATIVE_ASSET, SWAP_ERC20_ASSET);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('preserves manual destination metadata and visibility', async () => {
    const manualAsset = { standard: EvmAssetStandardEnum.ERC20, manual: true, visibility: VisibilityEnum.Hidden };
    const manualState = {
      ...state,
      evmAssets: {
        ...assets,
        record: {
          [SWAP_OWNER]: { 42793: { ...assets.record[SWAP_OWNER][42793], [SWAP_TOKEN_ADDRESS]: manualAsset } }
        }
      }
    };
    jest.mocked(store.getState).mockReturnValue(manualState);
    await refreshSwapBalances(network, 'account', SWAP_OWNER, SWAP_NATIVE_ASSET, SWAP_ERC20_ASSET);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'evm/tokens-metadata/PROCESS_LOADED_EVM_TOKENS_METADATA',
        payload: expect.objectContaining({
          metadata: expect.not.objectContaining({ [SWAP_TOKEN_ADDRESS]: expect.anything() })
        })
      })
    );
    const action = jest
      .mocked(dispatch)
      .mock.calls.map(([value]) => value)
      .find(mergeEvmAssetsAction.match);
    if (!action) throw new Error('Missing asset merge');
    const merged = evmAssetsPersistedReducer(manualState.evmAssets, action);
    expect(merged.record[SWAP_OWNER][42793][SWAP_TOKEN_ADDRESS]).toEqual(manualAsset);
  });

  it('uses bounded retries for delayed RPC data', async () => {
    jest.useFakeTimers();
    rpc.readContract.mockResolvedValueOnce(0n).mockResolvedValue(456n);
    const refresh = refreshSwapBalances(network, 'account', SWAP_OWNER, SWAP_NATIVE_ASSET, SWAP_ERC20_ASSET);
    await jest.advanceTimersByTimeAsync(1000);
    await refresh;
    expect(rpc.readContract).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });
});
