import { BigNumber } from 'bignumber.js';
import React, { useMemo } from 'react';
import { View, Text } from 'react-native';

import { ActivityGroupsList } from 'src/components/activity-groups-list/activity-groups-list';
import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { ButtonLargeWhite } from 'src/components/button/button-large/button-large-white/button-large-white';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { Divider } from 'src/components/divider/divider';
import { FormattedAmount } from 'src/components/formatted-amount';
import { HeaderCard } from 'src/components/header-card/header-card';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { LpTokenIcon } from 'src/components/icon/lp-token-icon/lp-token-icon';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { useBlockSubscription } from 'src/hooks/block-subscription/use-block-subscription.hook';
import { useContractActivity } from 'src/hooks/use-contract-activity';
import { useAuthorisedInterval } from 'src/hooks/use-interval.hook';
import { useSirsInfo } from 'src/hooks/use-sirs-info.hook';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useContract } from 'src/op-params/liquidity-baking/contracts';
import { liquidityBakingStorageInitialValue } from 'src/op-params/liquidity-baking/liquidity-baking-storage.interface';
import { useUsdToTokenRates } from 'src/store/currency/currency-selectors';
import { useAssetsListSelector, useSelectedAccountTezosTokenSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { LIQUIDITY_BAKING_DEX_ADDRESS, KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';
import { emptyToken } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { estimateLiquidityBakingAPY } from 'src/utils/liquidity-baking.util';
import { mutezToTz } from 'src/utils/tezos.util';

import { LiquidityBakingDappSelectors } from './liquidity-baking-dapp.selectors';
import { useLiquidityBakingDappStyles } from './liquidity-baking-dapp.styles';

const DATA_REFRESH_INTERVAL = 50 * 1000;

export const LiquidityBakingDapp = () => {
  const { navigate } = useNavigation();
  const blockSubscription = useBlockSubscription();
  const styles = useLiquidityBakingDappStyles();
  const assetsList = useAssetsListSelector();
  const exchangeRates = useUsdToTokenRates();
  const { token, isPositiveBalance } = useSirsInfo();

  const lpContract = useContract(LIQUIDITY_BAKING_DEX_ADDRESS, liquidityBakingStorageInitialValue);

  const aToken = useSelectedAccountTezosTokenSelector();
  const bToken = assetsList.find(token => getTokenSlug(token) === KNOWN_TOKENS_SLUGS.tzBTC) ?? emptyToken;

  const aTokenPool = lpContract.storage.xtzPool;

  const bTokenPool = lpContract.storage.tokenPool;

  const { activities, handleUpdate, handleRefresh } = useContractActivity(LIQUIDITY_BAKING_DEX_ADDRESS);

  useAuthorisedInterval(handleRefresh, DATA_REFRESH_INTERVAL, [blockSubscription.block.header]);

  usePageAnalytic(ScreensEnum.LiquidityBakingDapp, `${aToken.address}_${aToken.id} ${bToken.address}_${bToken.id}`);

  const volumePrice = useMemo(() => {
    const tezosPoolInTz = mutezToTz(aTokenPool, aToken.decimals);
    const tezVolumePriceInDollar = tezosPoolInTz.multipliedBy(exchangeRates.tez);
    const tzBtcPoolInTz = mutezToTz(bTokenPool, bToken.decimals);
    const tzBtcVolumePriceInDollar = tzBtcPoolInTz.multipliedBy(exchangeRates[getTokenSlug(bToken)]);

    const result = tezVolumePriceInDollar.plus(tzBtcVolumePriceInDollar);

    return result.isNaN() ? new BigNumber(0) : result;
  }, [exchangeRates, aTokenPool, bTokenPool]);

  const apy = useMemo(() => estimateLiquidityBakingAPY(aTokenPool)?.toFixed(2), [aTokenPool]);

  return (
    <>
      <HeaderCard>
        <Divider size={formatSize(8)} />
        <View style={styles.lbCoinContainer}>
          <View style={styles.lbWrapper}>
            <LpTokenIcon firstTokenIcon={IconNameEnum.TezToken} secondTokenIcon={IconNameEnum.LbTokenIcon} />
            <Text style={styles.lbCoinText}>XTZ/tzBTC</Text>
          </View>

          {isDefined(token) && isPositiveBalance && (
            <View style={styles.lbWrapper}>
              <Text style={styles.lbGreyText}>Balance:</Text>
              <AssetValueText asset={token} amount={token.balance} style={styles.lbBoldText} />
            </View>
          )}
        </View>
        <View style={styles.bottomLbContainer}>
          <View>
            <Text style={styles.priceTitle}>TVL</Text>
            <FormattedAmount style={styles.priceValue} amount={volumePrice} isDollarValue={true} />
          </View>
          <View>
            <Text style={styles.priceTitle}>APY</Text>
            <Text style={styles.priceValue}>{apy}%</Text>
          </View>
        </View>
        <Divider size={formatSize(8)} />
        <View style={styles.lineDivider} />
        <Divider size={formatSize(16)} />
        <ButtonsContainer>
          <View style={styles.buttonContainer}>
            <ButtonLargeWhite
              title="REMOVE"
              iconName={IconNameEnum.MinusIcon}
              onPress={() =>
                navigate(ModalsEnum.RemoveLiquidity, {
                  lpContractAddress: LIQUIDITY_BAKING_DEX_ADDRESS,
                  aToken,
                  bToken
                })
              }
              testID={LiquidityBakingDappSelectors.removeButton}
            />
          </View>
          <Divider size={formatSize(16)} />
          <View style={styles.buttonContainer}>
            <ButtonLargeWhite
              title="ADD"
              iconName={IconNameEnum.PlusIcon}
              onPress={() =>
                navigate(ModalsEnum.AddLiquidity, { lpContractAddress: LIQUIDITY_BAKING_DEX_ADDRESS, aToken, bToken })
              }
              testID={LiquidityBakingDappSelectors.addButton}
            />
          </View>
        </ButtonsContainer>
      </HeaderCard>
      <Text style={styles.sectionHeaderText}>My Recent Transactions</Text>
      <ActivityGroupsList handleUpdate={handleUpdate} activityGroups={activities} />
      <ScreenContainer />
    </>
  );
};
