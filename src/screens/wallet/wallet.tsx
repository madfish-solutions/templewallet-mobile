import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { CurrentAccountDropdown } from '../../components/account-dropdown/current-account-dropdown';
import { Divider } from '../../components/divider/divider';
import { HeaderCardActionButtons } from '../../components/header-card-action-buttons/header-card-action-buttons';
import { HeaderCard } from '../../components/header-card/header-card';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TokenEquityValue } from '../../components/token-equity-value/token-equity-value';
import { ScreensEnum } from '../../navigator/screens.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
import {
  loadTezosBalanceActions,
  loadTokenBalancesActions,
  setSelectedAccountAction
} from '../../store/wallet/wallet-actions';
import {
  useHdAccountsListSelector,
  useSelectedAccountSelector,
  useTezosBalanceSelector,
  useTokensListSelector
} from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { XTZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { tokenMetadataSlug } from '../../token/utils/token.utils';
import { TokenListItem } from './token-list-item/token-list-item';
import { WalletStyles } from './wallet.styles';

export const Wallet = () => {
  const colors = useColors();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const selectedAccount = useSelectedAccountSelector();
  const hdAccounts = useHdAccountsListSelector();
  const tokensList = useTokensListSelector();
  const tezosBalance = useTezosBalanceSelector();

  useEffect(() => {
    dispatch(loadTokenBalancesActions.submit(selectedAccount.publicKeyHash));
    dispatch(loadTezosBalanceActions.submit(selectedAccount.publicKeyHash));
  }, [selectedAccount.publicKeyHash]);

  return (
    <>
      <HeaderCard hasInsetTop={true}>
        <View style={WalletStyles.accountContainer}>
          <CurrentAccountDropdown
            value={selectedAccount}
            list={hdAccounts}
            onValueChange={value => dispatch(setSelectedAccountAction(value?.publicKeyHash))}
          />

          <Icon name={IconNameEnum.QrScanner} size={formatSize(24)} color={colors.disabled} />
        </View>

        <TokenEquityValue balance={tezosBalance} symbol={XTZ_TOKEN_METADATA.symbol} />

        <HeaderCardActionButtons />
      </HeaderCard>

      <ScreenContainer>
        <TokenListItem
          symbol={XTZ_TOKEN_METADATA.symbol}
          name={XTZ_TOKEN_METADATA.name}
          balance={tezosBalance}
          apy={8}
          iconName={XTZ_TOKEN_METADATA.iconName}
          onPress={() => navigate(ScreensEnum.TezosTokenScreen)}
        />

        {tokensList.map(token => (
          <TokenListItem
            key={token.address}
            symbol={token.symbol}
            name={token.name}
            balance={token.balance}
            iconName={token.iconName}
            onPress={() => navigate(ScreensEnum.TokenScreen, { slug: tokenMetadataSlug(token) })}
          />
        ))}

        <Divider />
      </ScreenContainer>
    </>
  );
};
