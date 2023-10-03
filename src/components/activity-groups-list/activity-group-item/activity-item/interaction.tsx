import {
  ActivitySubtype,
  AllowanceInteractionActivity,
  InteractionActivity,
  QuipuswapActivity,
  Route3Activity
} from '@temple-wallet/transactions-parser';
import { isEmpty } from 'lodash-es';
import React, { FC, memo, useMemo } from 'react';
import { View, Text } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { useNonZeroAmounts } from 'src/hooks/use-non-zero-amounts.hook';
import { ActivityAmount } from 'src/interfaces/non-zero-amounts.interface';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { calculateDollarValue, separateAmountsBySign } from 'src/utils/activity.utils';
import { tzktUrl } from 'src/utils/linking';

import { ActivityGroupAmountChange } from '../activity-group-amount-change/activity-group-amount-change';
import { ActivityGroupDollarAmountChange } from '../activity-group-dollar-amount-change/activity-group-dollar-amount-change';
import {
  useActivityCommonStyles,
  useActivityDetailsStyles,
  useActivityGroupItemStyles
} from '../activity-group-item.styles';
import { ItemAmountChange } from '../item-amount-change/item-amount-change';
import { ActivityGroupItemSelectors } from '../selectors';
import { AbstractItem } from './abstract-item';
import { ChangeAllowance } from './change-allowance';
import { ActivityItemProps } from './item.props';
import { Quipuswap } from './quipuswap';
import { Route3 } from './route3';

export const Interaction: FC<ActivityItemProps> = memo(({ activity }) => {
  const nonZeroAmounts = useNonZeroAmounts(activity.tokensDeltas);

  switch ((activity as InteractionActivity).subtype) {
    case ActivitySubtype.ChangeAllowance:
      return <ChangeAllowance activity={activity as AllowanceInteractionActivity} />;

    case ActivitySubtype.Route3:
      return <Route3 activity={activity as Route3Activity} />;

    case ActivitySubtype.QuipuswapCoinflipBet:
    case ActivitySubtype.QuipuswapCoinflipWin:
    case ActivitySubtype.QuipuswapAddLiqiudityV1:
    case ActivitySubtype.QuipuswapRemoveLiquidityV1:
    case ActivitySubtype.QuipuswapAddLiqiudityV2:
    case ActivitySubtype.QuipuswapRemoveLiquidityV2:
    case ActivitySubtype.QuipuswapAddLiqiudityV3:
    case ActivitySubtype.QuipuswapRemoveLiquidityV3:
    case ActivitySubtype.QuipuswapAddLiquidityStableswap:
    case ActivitySubtype.QuipuswapRemoveLiquidityStableswap:
    case ActivitySubtype.QuipuswapInvestInDividents:
    case ActivitySubtype.QuipuswapDivestFromDividents:
    case ActivitySubtype.QuipuswapInvestInFarm:
    case ActivitySubtype.QuipuswapDivestFromFarm:
    case ActivitySubtype.QuipuswapHarvestFromFarm:
    case ActivitySubtype.QuipuswapHarvestFromDividents:
      return <Quipuswap activity={activity as QuipuswapActivity} nonZeroAmounts={nonZeroAmounts} />;

    default:
      return (
        <AbstractItem
          status={activity.status}
          timestamp={activity.timestamp}
          face={<Face nonZeroAmounts={nonZeroAmounts} />}
          details={<Details hash={activity.hash} nonZeroAmounts={nonZeroAmounts} />}
        />
      );
  }
});

const Face: FC<{ nonZeroAmounts: Array<ActivityAmount> }> = ({ nonZeroAmounts }) => {
  const styles = useActivityGroupItemStyles();
  const commonStyles = useActivityCommonStyles();

  return (
    <View style={[commonStyles.row, commonStyles.itemsCenter]}>
      <View style={styles.flex}>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.operationTitle}>Interaction</Text>
          <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} />
        </View>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.operationSubtitle}>-</Text>
          <ActivityGroupDollarAmountChange dollarValue={calculateDollarValue(nonZeroAmounts)} />
        </View>
      </View>
    </View>
  );
};

const Details: FC<{ hash: string; nonZeroAmounts: Array<ActivityAmount> }> = ({ hash, nonZeroAmounts }) => {
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const styles = useActivityDetailsStyles();

  const commonStyles = useActivityCommonStyles();

  const { positiveAmounts, negativeAmounts } = useMemo(() => separateAmountsBySign(nonZeroAmounts), [nonZeroAmounts]);

  return (
    <>
      {!isEmpty(positiveAmounts) && (
        <View style={[styles.itemWrapper, styles.border]}>
          <Text style={styles.text}>Received:</Text>
          <View>
            {positiveAmounts.map((amount, index) => (
              <View style={styles.mb8} key={index}>
                <ItemAmountChange amount={amount.parsedAmount} isPositive={amount.isPositive} symbol={amount.symbol} />
                <ActivityGroupDollarAmountChange dollarValue={amount.fiatAmount} />
              </View>
            ))}
          </View>
        </View>
      )}
      {!isEmpty(negativeAmounts) && (
        <View style={[styles.itemWrapper, styles.border]}>
          <Text style={styles.text}>Sent:</Text>
          <View>
            {negativeAmounts.map((amount, index) => (
              <View style={styles.mb8} key={index}>
                <ItemAmountChange amount={amount.parsedAmount} isPositive={amount.isPositive} symbol={amount.symbol} />
                <ActivityGroupDollarAmountChange dollarValue={amount.fiatAmount} />
              </View>
            ))}
          </View>
        </View>
      )}
      <View style={styles.itemWrapper}>
        <Text style={styles.text}>TxHash:</Text>
        <View style={commonStyles.row}>
          <PublicKeyHashText longPress publicKeyHash={hash} testID={ActivityGroupItemSelectors.operationHash} />
          <Divider size={formatSize(4)} />
          <ExternalLinkButton url={tzktUrl(selectedRpcUrl, hash)} testID={ActivityGroupItemSelectors.externalLink} />
        </View>
      </View>
    </>
  );
};
