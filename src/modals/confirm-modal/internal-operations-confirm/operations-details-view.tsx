import { noop } from 'lodash';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { PublicKeyHashText } from '../../../components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from '../../../components/robot-icon/robot-icon';
import { InternalOperationsPayload } from '../../../interfaces/confirm-payload/internal-operations-payload.interface';
import { TokenTypeEnum } from '../../../interfaces/token-type.enum';
import { useBakersListSelector } from '../../../store/baking/baking-selectors';
import { useHdAccountsListSelector, useTokensListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { XTZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';
import { tryParseExpenses } from '../../../utils/expenses.util';
import { mutezToTz } from '../../../utils/tezos.util';
import { SelectBakerItem } from '../../select-baker-modal/select-baker-item/select-baker-item';
import { useOpsDetailsStyles } from './operations-details-view.styles';

export const OperationDetailsView: FC<Pick<InternalOperationsPayload, 'opParams' | 'sourcePkh'>> = ({
  opParams,
  sourcePkh
}) => {
  const hdAccounts = useHdAccountsListSelector();
  const styles = useOpsDetailsStyles();
  const knownBakers = useBakersListSelector();

  const sourceAccount = hdAccounts.find(({ publicKeyHash }) => publicKeyHash === sourcePkh);
  const rawExpenses = tryParseExpenses(opParams, sourcePkh);
  const rawPureExpenses = rawExpenses.map(({ expenses }) => expenses).flat();
  const firstExpense = rawPureExpenses[0];
  const firstExpenseRecipientAccount =
    firstExpense && hdAccounts.find(({ publicKeyHash }) => publicKeyHash === firstExpense.to);
  const tokens = useTokensListSelector();
  const firstExpenseToken =
    firstExpense &&
    tokens.find(
      ({ type, address, id }) =>
        firstExpense.tokenAddress === address && (type !== TokenTypeEnum.FA_2 || id === firstExpense.tokenId)
    );

  if (opParams.length > 1) {
    return <Text>Displaying multiple operations isn't supported yet.</Text>;
  }

  if (opParams[0].kind === 'delegation') {
    const { delegate } = opParams[0];
    const baker = knownBakers.find(({ address }) => address === delegate);

    return (
      <View>
        <Text style={styles.label}>Account</Text>
        <Divider size={formatSize(28)} />
        <View style={styles.accountView}>
          <View style={styles.shortInfoSection}>
            <RobotIcon size={formatSize(44)} seed={sourcePkh} />
            <View style={styles.accountTitle}>
              <Text style={styles.delegationAccountLabel}>{sourceAccount?.name ?? ''}</Text>
              <PublicKeyHashText publicKeyHash={sourcePkh} />
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
          <View style={styles.senderView}>
            <Text style={styles.label}>From</Text>
            <RobotIcon size={formatSize(44)} seed={sourcePkh} />
            <Text style={styles.accountLabel}>{sourceAccount?.name ?? ''}</Text>
            <PublicKeyHashText publicKeyHash={sourcePkh} />
          </View>
          <View style={styles.arrowContainer}>
            <Icon size={formatSize(24)} name={IconNameEnum.ArrowRight} style={styles.arrowIcon} />
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
