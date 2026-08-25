import React, { FC, Fragment, useMemo } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { FormattedAmount } from 'src/components/formatted-amount';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { formatSize } from 'src/styles/format-size';
import { getDollarValue } from 'src/utils/balance.utils';
import { EvmBalanceChange, EvmBalancesChangesGroup } from 'src/utils/evm/on-chain/transactions';
import { isDefined } from 'src/utils/is-defined';
import { ZERO } from 'src/utils/number.util';

import { OperationPreviewAssetAmounts } from '../../common/operation-preview-asset-amounts';
import { OperationPreviewCard } from '../../common/operation-preview-card';

import { useWcTransactionPreviewStyles } from './wc-transaction-preview.styles';

interface Props {
  groups: EvmBalancesChangesGroup[];
  getAsset: SyncFn<EvmBalanceChange, AssetInterface | undefined>;
  getDescription: SyncFn<EvmBalancesChangesGroup, string>;
  getPublicKeyHash?: SyncFn<EvmBalancesChangesGroup, string | undefined>;
}

export const WcBalancesChangesPreviewGroups: FC<Props> = ({ groups, getAsset, getDescription, getPublicKeyHash }) => (
  <>
    {groups.map((group, groupIndex) => {
      const publicKeyHash = getPublicKeyHash?.(group) ?? group.receiver;

      return (
        <Fragment key={group.receiver ?? 'unknown'}>
          <WcBalancesChangesPreviewGroup
            description={getDescription(group)}
            publicKeyHash={publicKeyHash}
            changes={group.changes}
            getAsset={getAsset}
          />
          {groupIndex < groups.length - 1 ? <Divider size={formatSize(8)} /> : null}
        </Fragment>
      );
    })}
  </>
);

interface GroupProps {
  description: string;
  publicKeyHash?: string;
  changes: EvmBalanceChange[];
  getAsset: SyncFn<EvmBalanceChange, AssetInterface | undefined>;
}

const WcBalancesChangesPreviewGroup: FC<GroupProps> = ({ description, publicKeyHash, changes, getAsset }) => {
  const styles = useWcTransactionPreviewStyles();

  const totalEquity = useMemo(() => {
    let total = ZERO;
    let hasPricedAsset = false;

    for (const change of changes) {
      const asset = getAsset(change);

      if (!isDefined(asset) || !isDefined(asset.exchangeRate) || !isDefined(asset.decimals)) {
        continue;
      }

      hasPricedAsset = true;
      const dollarValue = getDollarValue(change.amount.abs(), asset.decimals, asset.exchangeRate);
      total = change.amount.isNegative() ? total.minus(dollarValue) : total.plus(dollarValue);
    }

    return hasPricedAsset ? total : undefined;
  }, [changes, getAsset]);

  return (
    <OperationPreviewCard iconSeed={publicKeyHash} description={description} publicKeyHash={publicKeyHash}>
      <View style={styles.amountsColumn}>
        <Divider size={formatSize(8)} />
        {changes.map((change, index) => {
          const asset = getAsset(change);
          const amount = change.amount.abs().toFixed();
          const isNegative = change.amount.isNegative();
          const amountStyle = isNegative ? styles.amountToken : styles.amountTokenSuccess;

          return (
            <Fragment key={change.assetSlug}>
              {index > 0 ? <Divider size={formatSize(4)} /> : null}
              {isDefined(asset) ? (
                <OperationPreviewAssetAmounts
                  amount={amount}
                  asset={asset}
                  receiver={publicKeyHash}
                  showMinusSign={isNegative}
                  showDollar={false}
                  textStyle={isNegative ? undefined : styles.amountTokenSuccess}
                />
              ) : (
                <Text style={amountStyle}>
                  {isNegative ? '-' : ''}
                  {amount} ???
                </Text>
              )}
            </Fragment>
          );
        })}
        {isDefined(totalEquity) && !totalEquity.isZero() ? (
          <>
            <Divider size={formatSize(8)} />
            <FormattedAmount
              amount={totalEquity.abs()}
              isDollarValue
              showMinusSign={totalEquity.isNegative()}
              showPlusSign={totalEquity.isPositive()}
              style={totalEquity.isNegative() ? styles.amountDollar : styles.amountDollarAdding}
            />
          </>
        ) : null}
      </View>
    </OperationPreviewCard>
  );
};
