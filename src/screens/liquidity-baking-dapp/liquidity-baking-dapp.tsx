import { BigNumber } from 'bignumber.js';
import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { AccountDropdown } from '../../components/account-dropdown/account-dropdown';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { Divider } from '../../components/divider/divider';
import { FormattedAmount } from '../../components/formatted-amount';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { LpTokenIcon } from '../../components/icon/lp-token-icon/lp-token-icon';
import { TouchableIcon } from '../../components/icon/touchable-icon/touchable-icon';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useContract } from '../../op-params/liquidity-baking/contracts';
import {
  LiquidityBakingStorage,
  liquidityBakingStorageInitialValue
} from '../../op-params/liquidity-baking/liquidity-baking-storage.interface';
import { LiquidityBakingContractAbstraction } from '../../op-params/liquidity-baking/liquidity-baking.contract-abstraction.interface';
import { useExchangeRatesSelector } from '../../store/currency/currency-selectors';
import { setSelectedAccountAction } from '../../store/wallet/wallet-actions';
import {
  useAssetsListSelector,
  useSelectedAccountSelector,
  useTezosTokenSelector,
  useVisibleAccountsListSelector
} from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { LIQUIDITY_BAKING_DEX_ADDRESS, TZ_BTC_TOKEN_SLUG } from '../../token/data/token-slugs';
import { emptyToken } from '../../token/interfaces/token.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { mutezToTz } from '../../utils/tezos.util';
import { useLiquidityBakingDappStyles } from './liquidity-baking-dapp.styles';

export const LiquidityBakingDapp = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const styles = useLiquidityBakingDappStyles();
  const assetsList = useAssetsListSelector();
  const exchangeRates = useExchangeRatesSelector();
  const selectedAccount = useSelectedAccountSelector();
  const visibleAccounts = useVisibleAccountsListSelector();

  const lpContract = useContract<LiquidityBakingContractAbstraction, LiquidityBakingStorage>(
    LIQUIDITY_BAKING_DEX_ADDRESS,
    liquidityBakingStorageInitialValue
  );

  const aToken = useTezosTokenSelector() ?? emptyToken;
  const bToken = assetsList.find(token => getTokenSlug(token) === TZ_BTC_TOKEN_SLUG) ?? emptyToken;

  const aTokenPool = lpContract.storage.xtzPool;
  const bTokenPool = lpContract.storage.tokenPool;

  const volumePrice = useMemo(() => {
    const tezosPoolInTz = mutezToTz(aTokenPool, aToken.decimals);
    const tezVolumePriceInDollar = tezosPoolInTz.multipliedBy(exchangeRates.tez);
    const tzBtcPoolInTz = mutezToTz(bTokenPool, bToken.decimals);
    const tzBtcVolumePriceInDollar = tzBtcPoolInTz.multipliedBy(exchangeRates[getTokenSlug(bToken)]);

    const result = tezVolumePriceInDollar.plus(tzBtcVolumePriceInDollar);

    return result.isNaN() ? new BigNumber(0) : result;
  }, [exchangeRates, aTokenPool, bTokenPool]);

  return (
    <ScreenContainer>
      <InsetSubstitute type="top" />
      <View style={styles.accountContainer}>
        <AccountDropdown
          value={selectedAccount}
          list={visibleAccounts}
          onValueChange={value => dispatch(setSelectedAccountAction(value?.publicKeyHash))}
        />
        <View style={styles.accountActionsContainer}>
          <TouchableIcon
            size={formatSize(16)}
            name={IconNameEnum.MoreHorizontal}
            onPress={() => navigate(ScreensEnum.DApps)}
          />
          <View style={styles.verticalLineDivider} />
          <TouchableIcon
            size={formatSize(16)}
            name={IconNameEnum.XCircle}
            onPress={() => navigate(ScreensEnum.DApps)}
          />
        </View>
      </View>
      <View style={styles.lineDivider} />
      <Divider size={formatSize(8)} />
      <View style={styles.lbCoinContainer}>
        <LpTokenIcon firstTokenIcon={IconNameEnum.TezToken} secondTokenIcon={IconNameEnum.LbTokenIcon} />
        <Text style={styles.lbCoinText}>XTZ/tzBTC</Text>
        <Divider size={formatSize(8)} />
      </View>
      <View style={styles.bottomLbContainer}>
        <View>
          <Text style={styles.priceTitle}>TVL</Text>
          <FormattedAmount style={styles.priceValue} amount={volumePrice} isDollarValue={true} />
        </View>
      </View>
      <Divider size={formatSize(8)} />
      <View style={styles.lineDivider} />
      <Divider size={formatSize(16)} />
      <ButtonsContainer>
        <View style={styles.buttonContainer}>
          <ButtonLargePrimary
            title="REMOVE"
            iconName={IconNameEnum.MinusIcon}
            onPress={() => navigate(ModalsEnum.RemoveLiquidity, { lpContract, aToken, bToken })}
          />
        </View>
        <Divider size={formatSize(16)} />
        <View style={styles.buttonContainer}>
          <ButtonLargePrimary
            title="ADD"
            iconName={IconNameEnum.PlusIcon}
            onPress={() => navigate(ModalsEnum.AddLiquidity, { lpContract, aToken, bToken })}
          />
        </View>
      </ButtonsContainer>
    </ScreenContainer>
  );
};
