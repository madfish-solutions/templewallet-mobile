import { createAction } from '@reduxjs/toolkit';

import { AccountInterface } from '../../interfaces/account.interface';
import { ActivityGroup } from '../../interfaces/activity.interface';
import { SendAssetActionPayloadInterface } from '../../interfaces/send-asset-action-payload.interface';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { createActions } from '../create-actions';

export const setSelectedAccountAction = createAction<string | undefined>('wallet/SET_SELECTED_ACCOUNT');
export const addHdAccountAction = createAction<AccountInterface>('wallet/ADD_HD_ACCOUNT');
export const updateWalletAccountAction = createAction<WalletAccountInterface>('wallet/UPDATE_WALLET_ACCOUNT');

// TODO: extract AssetsState
export const loadTokenBalancesActions = createActions<
  void,
  { balancesRecord: Record<string, string>; metadataList: TokenMetadataInterface[] },
  string
>('assets/LOAD_TOKENS');
export const loadTezosBalanceActions = createActions<void, string, string>('assets/LOAD_TEZOS');

export const loadQuipuApyActions = createActions<void, number, string>('assets/LOAD_QUIPU_APY');

export const loadTokenSuggestionActions = createActions<
  Pick<TokenMetadataInterface, 'id' | 'address'>,
  TokenMetadataInterface,
  string
>('assets/LOAD_TOKEN_SUGGESTION');
export const loadTokenMetadataActions = createActions<
  Pick<TokenMetadataInterface, 'id' | 'address'>,
  TokenMetadataInterface,
  string
>('assets/LOAD_TOKEN_METADATA');

export const addTokenMetadataAction = createAction<TokenMetadataInterface>('assets/ADD_TOKEN_METADATA');
export const removeTokenAction = createAction<string>('assets/REMOVE_TOKEN');
export const toggleTokenVisibilityAction = createAction<string>('assets/TOGGLE_TOKEN_VISIBILITY');

export const sendAssetActions = createActions<SendAssetActionPayloadInterface, string, string>('wallet/SEND_ASSET');

export const loadActivityGroupsActions = createActions<void, ActivityGroup[], string>('wallet/LOAD_ACTIVITY_GROUPS');
export const addPendingOperation = createAction<ActivityGroup>('wallet/ADD_PENDING_OPERATION');

export const waitForOperationCompletionAction = createAction<{
  opHash: string;
  sender: AccountInterface;
}>('d-apps/WAIT_FOR_OPERATION_COMPLETION');

export const migrateAssetsVisibility = createAction('migration/MIGRATE_ASSETS_VISIBILITY');
