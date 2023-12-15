import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { EMPTY_PUBLIC_KEY_HASH } from 'src/config/system';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { loadTezosBalanceActions, loadTokensBalancesArrayActions } from 'src/store/wallet/wallet-actions';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';

import { useBlockSubscription } from '../block-subscription/use-block-subscription.hook';

import { useMetadataLoading } from './use-metadata-loading';

export const useMainHooks = () => {
  const dispatch = useDispatch();

  const selectedAccountPkh = useCurrentAccountPkhSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const blockSubscription = useBlockSubscription();

  useEffect(() => {
    if (!selectedAccountPkh || selectedAccountPkh === EMPTY_PUBLIC_KEY_HASH) {
      return;
    }

    dispatch(loadTezosBalanceActions.submit());
    dispatch(loadTokensBalancesArrayActions.submit());
  }, [blockSubscription.block.header.level, selectedAccountPkh, selectedRpcUrl]);

  useMetadataLoading(selectedAccountPkh);
};
