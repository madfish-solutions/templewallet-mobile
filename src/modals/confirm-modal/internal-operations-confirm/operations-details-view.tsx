import { noop } from 'lodash';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { PublicKeyHashText } from '../../../components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from '../../../components/robot-icon/robot-icon';
import { InternalOperationsPayload } from '../../../interfaces/confirm-payload/internal-operations-payload.interface';
import { useBakersListSelector } from '../../../store/baking/baking-selectors';
import { useHdAccountsListSelector, useTokensListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { XTZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';
import { tryParseExpenses } from '../../../utils/expenses.util';
import { mutezToTz } from '../../../utils/tezos.util';
import { SelectBakerItem } from '../../select-baker-modal/select-baker-item/select-baker-item';
import { useOpsDetailsStyles } from './operations-details-view.styles';

export const OperationDetailsView: FC<Pick<InternalOperationsPayload, 'operationsParams' | 'sourcePublicKeyHash'>> = ({
  operationsParams,
  sourcePublicKeyHash
}) => {
  const hdAccounts = useHdAccountsListSelector();
  const colors = useColors();
  const styles = useOpsDetailsStyles();
  const knownBakers = useBakersListSelector();

  const sourceAccount = hdAccounts.find(({ publicKeyHash }) => publicKeyHash === sourcePublicKeyHash);
  const rawExpenses = tryParseExpenses(operationsParams, sourcePublicKeyHash);
  const rawPureExpenses = rawExpenses.map(({ expenses }) => expenses).flat();
  const firstExpense = rawPureExpenses[0];
  const firstExpenseRecipientAccount =
    firstExpense && hdAccounts.find(({ publicKeyHash }) => publicKeyHash === firstExpense.to);
  const tokens = useTokensListSelector();
  const firstExpenseToken =
    firstExpense &&
    tokens.find(({ address, id }) => firstExpense.tokenAddress === address && id === firstExpense.tokenId);

  if (operationsParams.length > 1) {
    return <Text>Displaying multiple operations isn't supported yet.</Text>;
  }

  if (operationsParams[0].kind === 'delegation') {
    const { delegate } = operationsParams[0];
    const baker = knownBakers.find(({ address }) => address === delegate);

    return (
      <View>
        <Text style={styles.label}>Account</Text>
        <Divider size={formatSize(28)} />
        <View style={styles.accountView}>
          <View style={styles.shortInfoSection}>
            <RobotIcon size={formatSize(44)} seed={sourcePublicKeyHash} />
            <View style={styles.accountTitle}>
              <Text style={styles.delegationAccountLabel}>{sourceAccount?.name ?? ''}</Text>
              <PublicKeyHashText publicKeyHash={sourcePublicKeyHash} />
            </View>
          </View>
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>{sourceAccount?.tezosBalance.data ?? 'XXX.XX'} XTZ</Text>
          </View>
        </View>
        <Divider size={formatSize(32)} />
        <View>
          <View style={styles.previewTitleWrapper}>
            <Text style={styles.label}>Preview</Text>
          </View>
          <Divider size={formatSize(8)} />
          {baker ? (
            <SelectBakerItem baker={baker} selected={false} onPress={noop} />
          ) : (
            <View style={styles.unknownBakerLabel}>
              <Text style={styles.unknownBakerText}>Unknown baker</Text>
              <PublicKeyHashText publicKeyHash={delegate} />
            </View>
          )}
        </View>
        <Divider size={formatSize(16)} />
      </View>
    );
  }

  const assetDecimals = firstExpenseToken?.decimals ?? XTZ_TOKEN_METADATA.decimals;
  const assetSymbol = firstExpenseToken?.symbol ?? XTZ_TOKEN_METADATA.symbol;

  return (
    <>
      <View style={styles.row}>
        <View style={styles.sendAddressesLeftHalf}>
          <View>
            <Text style={styles.label}>From</Text>
            <RobotIcon size={formatSize(44)} seed={sourcePublicKeyHash} />
            <Text style={styles.accountLabel}>{sourceAccount?.name ?? ''}</Text>
            <PublicKeyHashText publicKeyHash={sourcePublicKeyHash} />
          </View>
          <View style={styles.arrowContainer}>
            <Icon name={IconNameEnum.ArrowRight} size={formatSize(24)} color={colors.destructive} />
          </View>
        </View>
        <View style={styles.recipientView}>
          <Text style={styles.label}>To</Text>
          <RobotIcon size={formatSize(44)} seed={rawPureExpenses[0].to} />
          <Text style={styles.accountLabel}>{firstExpenseRecipientAccount?.name ?? ''}</Text>
          <PublicKeyHashText publicKeyHash={rawPureExpenses[0].to} />
        </View>
      </View>
      <Divider />
      <View>
        <View style={styles.previewTitleWrapper}>
          <Text style={styles.label}>Amount</Text>
        </View>
        <Divider size={formatSize(16)} />
        {rawPureExpenses[0].amount && (
          <>
            <Text style={styles.totalNumber}>
              {mutezToTz(rawPureExpenses[0].amount, assetDecimals).toFixed()} {assetSymbol}
            </Text>
            <Text style={styles.totalUsdNumber}>XXX.XX $</Text>
          </>
        )}
        <Divider />
      </View>
    </>
  );
};
