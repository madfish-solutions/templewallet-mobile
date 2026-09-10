import { BigNumber } from 'bignumber.js';
import React, { memo, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { FormattedAmount } from 'src/components/formatted-amount';
import { HeaderCardActionButtons } from 'src/components/header-card-action-buttons/header-card-action-buttons';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { MultichainTokenIcon } from 'src/components/multichain-token-icon';
import { getMultichainTokenIconProps } from 'src/components/multichain-token-icon/get-multichain-token-icon-props';
import { PublicShieldedBalancePills } from 'src/components/public-shielded-balance-pills/public-shielded-balance-pills';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { TruncatedText } from 'src/components/truncated-text';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { MultichainDisplayedToken } from 'src/hooks/evm/use-multichain-displayed-tokens.hook';
import { WalletSelectors } from 'src/screens/wallet/wallet.selectors';
import { useColors } from 'src/styles/use-colors';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

import { useTokenPageTitles } from '../use-token-page-titles.hook';

import { TokenApyPill } from './token-apy-pill';
import { useTokenPageSummaryStyles } from './token-page-summary.styles';

export const PUBLIC_TAB_INDEX = 0;
const HISTORY_TAB_VALUES = ['Public', 'Private'];

interface Props {
  token: MultichainDisplayedToken;
  scam?: boolean;
  historyTabIndex: number;
  onHistoryTabChange: (index: number) => void;
  onRebalancePress: EmptyFn;
  onSendPress?: EmptyFn;
  onRemoveScamToken?: EmptyFn;
}

export const TokenPageSummary = memo<Props>(
  ({ token, scam = false, historyTabIndex, onHistoryTabChange, onRebalancePress, onSendPress, onRemoveScamToken }) => {
    const styles = useTokenPageSummaryStyles();
    const colors = useColors();

    const isTezos = token.chainKind === TempleChainKind.Tezos;
    const isTezosGasToken = isTezos && token.slug === TEZ_TOKEN_SLUG;
    const { identityTitle, networkLabel } = useTokenPageTitles(token);

    const tokenAmount = useMemo(
      () => mutezToTz(new BigNumber(token.atomicBalance), token.decimals),
      [token.atomicBalance, token.decimals]
    );
    const fiatAmount = useMemo(() => new BigNumber(token.fiatValue ?? 0), [token.fiatValue]);

    return (
      <>
        <View style={styles.container}>
          <View style={styles.identityRow}>
            <View style={styles.identityLeft}>
              <MultichainTokenIcon {...getMultichainTokenIconProps(token)} />
              <View style={styles.identityTexts}>
                <TruncatedText style={styles.identityTitle}>{identityTitle}</TruncatedText>
                <Text style={styles.networkText}>{networkLabel}</Text>
              </View>
            </View>

            {scam && isTezos ? (
              <TouchableOpacity onPress={onRemoveScamToken} style={styles.scamContainer}>
                <IconV2 name={IconNameV2Enum.ScamInfo} size={16} color={colors.white} />
                <Text style={styles.scamText}>Scam</Text>
              </TouchableOpacity>
            ) : (
              isTezos && <TokenApyPill token={token} isTezosGasToken={isTezosGasToken} />
            )}
          </View>

          <HideBalance textStyle={styles.balanceText} interactive testID={WalletSelectors.tokenEquity}>
            <FormattedAmount amount={tokenAmount} symbol={token.symbol} />
          </HideBalance>
          {isDefined(token.fiatValue) && (
            <HideBalance textStyle={styles.fiatText}>
              <FormattedAmount amount={fiatAmount} isDollarValue />
            </HideBalance>
          )}

          {isTezosGasToken && (
            <View style={styles.balanceSplitRow}>
              <PublicShieldedBalancePills
                atomicBalance={token.atomicBalance}
                shieldedAtomicBalance={token.shieldedAtomicBalance}
              >
                <TouchableOpacity onPress={onRebalancePress} style={styles.rebalanceButton}>
                  <IconV2 name={IconNameV2Enum.SwapArrow} size={16} color={colors.blue} />
                </TouchableOpacity>
              </PublicShieldedBalancePills>
            </View>
          )}

          <View style={styles.actionsRow}>
            <HeaderCardActionButtons
              token={token}
              onSendPress={onSendPress}
              scopeReceiveToTokenChain
              style={styles.actionButtons}
            />
          </View>
        </View>

        {isTezosGasToken && (
          <View style={styles.tabsRow}>
            <TextSegmentControl
              selectedIndex={historyTabIndex}
              values={HISTORY_TAB_VALUES}
              onChange={onHistoryTabChange}
              testID="TezosTokenScreen/HistoryTab"
            />
          </View>
        )}
      </>
    );
  }
);
