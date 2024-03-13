import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { forkJoin } from 'rxjs';

import { useBeaconHandler } from 'src/beacon/use-beacon-handler.hook';
import {
  RATES_SYNC_INTERVAL,
  SELECTED_BAKER_SYNC_INTERVAL,
  NOTIFICATIONS_SYNC_INTERVAL,
  APR_REFRESH_INTERVAL
} from 'src/config/fixed-times';
import { EMPTY_PUBLIC_KEY_HASH } from 'src/config/system';
import { useBlockSubscription } from 'src/hooks/block-subscription/use-block-subscription.hook';
import { useAppLockTimer } from 'src/hooks/use-app-lock-timer.hook';
import { useAuthorisedInterval } from 'src/hooks/use-authed-interval';
import { useAtBootsplash } from 'src/hooks/use-hide-bootsplash';
import { useInAppUpdate } from 'src/hooks/use-in-app-update.hook';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useNFTDynamicLinks } from 'src/hooks/use-nft-dynamic-links.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { Shelter } from 'src/shelter/shelter';
import { loadSelectedBakerActions } from 'src/store/baking/baking-actions';
import { loadExchangeRates } from 'src/store/currency/currency-actions';
import { useUsdToTokenRates } from 'src/store/currency/currency-selectors';
import { loadTokensApyActions } from 'src/store/d-apps/d-apps-actions';
import { loadAllFarmsAndStakesAction } from 'src/store/farms/actions';
import { loadNotificationsAction } from 'src/store/notifications/notifications-actions';
import { loadAllSavingsAndStakesAction } from 'src/store/savings/actions';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { loadTezosBalanceActions, loadAssetsBalancesActions } from 'src/store/wallet/wallet-actions';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { shouldMoveToSoftwareInV1 } from 'src/utils/keychain.utils';

import { useMetadataLoading } from './use-metadata-loading';

export const useMainHooks = (isLocked: boolean) => {
  const dispatch = useDispatch();

  const selectedAccountPkh = useCurrentAccountPkhSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const exchangeRates = useUsdToTokenRates();
  const { navigate } = useNavigation();
  const atBootsplash = useAtBootsplash();

  const { isTezosNode } = useNetworkInfo();

  useInAppUpdate();
  useAppLockTimer();
  useBeaconHandler();
  useNFTDynamicLinks();

  const blockSubscription = useBlockSubscription();

  useEffect(() => {
    if (!selectedAccountPkh || selectedAccountPkh === EMPTY_PUBLIC_KEY_HASH) {
      return;
    }

    dispatch(loadTezosBalanceActions.submit());
    dispatch(loadAssetsBalancesActions.submit());
  }, [blockSubscription.block.header.level, selectedAccountPkh, selectedRpcUrl]);

  useMetadataLoading();

  useEffect(() => {
    if (atBootsplash || isLocked) {
      return;
    }

    const shelterMigrationSubscription = forkJoin([
      Shelter.newMigrationsExist(),
      Shelter.getShelterVersion()
    ]).subscribe(([shouldDoSomeMigrations, shelterVersion]) => {
      if (shouldDoSomeMigrations && shouldMoveToSoftwareInV1 && shelterVersion === 0) {
        navigate(ScreensEnum.SecurityUpdate);
      } else if (shouldDoSomeMigrations) {
        Shelter.doMigrations$().subscribe({
          error: e => console.error(e)
        });
      }
    });

    return () => shelterMigrationSubscription.unsubscribe();
  }, [navigate, isLocked, atBootsplash]);

  useAuthorisedInterval(() => dispatch(loadTokensApyActions.submit()), RATES_SYNC_INTERVAL, [exchangeRates]);
  useAuthorisedInterval(() => dispatch(loadSelectedBakerActions.submit()), SELECTED_BAKER_SYNC_INTERVAL, [
    selectedAccountPkh,
    selectedRpcUrl
  ]);

  useAuthorisedInterval(() => dispatch(loadExchangeRates.submit()), RATES_SYNC_INTERVAL);
  useAuthorisedInterval(() => dispatch(loadNotificationsAction.submit()), NOTIFICATIONS_SYNC_INTERVAL, [
    selectedAccountPkh
  ]);

  useAuthorisedInterval(() => {
    if (isTezosNode) {
      dispatch(loadAllFarmsAndStakesAction());
      dispatch(loadAllSavingsAndStakesAction());
    }
  }, APR_REFRESH_INTERVAL);
};
