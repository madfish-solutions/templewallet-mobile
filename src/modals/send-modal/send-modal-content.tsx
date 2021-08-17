import { OpKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { FormikProps } from 'formik';
import React, { FC, useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';

import { AccountFormDropdown } from '../../components/account-dropdown/account-form-dropdown';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { Divider } from '../../components/divider/divider';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TokenFormDropdown } from '../../components/token-dropdown/token-form-dropdown';
import { FormAddressInput } from '../../form/form-address-input';
import { FormCheckbox } from '../../form/form-checkbox';
import { FormNumericInput } from '../../form/form-numeric-input/form-numeric-input';
import { useFilteredTokenList } from '../../hooks/use-filtered-token-list.hook';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import {
  useAccountsListSelector,
  useSelectedAccountSelector,
  useTezosTokenSelector,
  useTokensListSelector
} from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { showWarningToast } from '../../toast/toast.utils';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { isDefined } from '../../utils/is-defined';
import { isString } from '../../utils/is-string';
import { isValidAddress, mutezToTz } from '../../utils/tezos.util';
import { getTezosTransferParams } from '../../utils/transfer-params.utils';
import { useAccountManagerKey } from '../confirmation-modal/operations-confirmation/hooks/use-account-manager-key';
import { useEstimations } from '../confirmation-modal/operations-confirmation/hooks/use-estimations.hook';
import { SendModalFormValues } from './send-modal.form';
import { useSendModalStyles } from './send-modal.styles';

interface SendModalContentProps
  extends Pick<FormikProps<SendModalFormValues>, 'values' | 'setFieldValue' | 'submitForm'> {
  onMaxAmountChange: (newFee: BigNumber) => void;
}

const FALLBACK_TEZ_FEE = new BigNumber(0.1);
const REVEAL_DEFAULT_FEE = new BigNumber(0.00142);

export const SendModalContent: FC<SendModalContentProps> = ({
  values,
  setFieldValue,
  submitForm,
  onMaxAmountChange
}) => {
  const { goBack } = useNavigation();
  const styles = useSendModalStyles();
  const accounts = useAccountsListSelector();
  const sender = useSelectedAccountSelector();
  const tokensList = useTokensListSelector();
  const { filteredTokensList } = useFilteredTokenList(tokensList, true);
  const tezosToken = useTezosTokenSelector();

  const receiverPublicKeyHash = values.transferBetweenOwnAccounts
    ? values.ownAccount.publicKeyHash
    : values.receiverPublicKeyHash;

  const minimalTezosTransferReceiverPublicKeyHash =
    isString(receiverPublicKeyHash) && isValidAddress(receiverPublicKeyHash)
      ? receiverPublicKeyHash
      : sender.publicKeyHash;

  const minimalTezosTransferParams = useMemo(
    () => [
      {
        ...getTezosTransferParams(
          minimalTezosTransferReceiverPublicKeyHash,
          mutezToTz(new BigNumber(1), TEZ_TOKEN_METADATA.decimals)
        ),
        kind: OpKind.TRANSACTION as const
      }
    ],
    [minimalTezosTransferReceiverPublicKeyHash]
  );
  const { data: accountManagerKey } = useAccountManagerKey(sender.publicKeyHash);
  const { data: minimalTezosTransferEstimations } = useEstimations(sender, minimalTezosTransferParams, false);

  const additionalFee = useMemo(() => {
    if (values.token.symbol !== TEZ_TOKEN_METADATA.symbol) {
      return new BigNumber(0);
    }

    if (minimalTezosTransferEstimations.length === 0) {
      return FALLBACK_TEZ_FEE;
    }

    const { gasLimit, storageLimit } = minimalTezosTransferEstimations[0];

    return mutezToTz(new BigNumber(gasLimit).plus(storageLimit), TEZ_TOKEN_METADATA.decimals).plus(
      isDefined(accountManagerKey) ? 0 : REVEAL_DEFAULT_FEE
    );
  }, [values.token.symbol, accountManagerKey, minimalTezosTransferEstimations]);

  useEffect(() => setFieldValue('amount', undefined), [values.token]);

  const amountMaxValue = useMemo(
    () => BigNumber.max(mutezToTz(new BigNumber(values.token.balance), values.token.decimals).minus(additionalFee), 0),
    [values.token, additionalFee]
  );

  useEffect(() => {
    onMaxAmountChange(amountMaxValue);
  }, [amountMaxValue, onMaxAmountChange]);

  const ownAccountsReceivers = useMemo(
    () => accounts.filter(({ publicKeyHash }) => publicKeyHash !== sender.publicKeyHash),
    [accounts, sender.publicKeyHash]
  );
  const transferBetweenOwnAccountsDisabled = ownAccountsReceivers.length === 0;

  const filteredTokensListWithTez = useMemo<TokenInterface[]>(
    () => [tezosToken, ...filteredTokensList],
    [tezosToken, filteredTokensList]
  );

  return (
    <ScreenContainer isFullScreenMode={true}>
      <ModalStatusBar />
      <View>
        <Label label="Asset" description="Select asset or token." />
        <TokenFormDropdown name="token" list={filteredTokensListWithTez} />
        <Divider />

        <Label label="To" description={`Address or Tezos domain to send ${values.token.symbol} funds to.`} />
        {values.transferBetweenOwnAccounts ? (
          <AccountFormDropdown name="ownAccount" list={accounts} />
        ) : (
          <FormAddressInput name="receiverPublicKeyHash" placeholder="e.g. address" />
        )}
        <View
          onTouchStart={() =>
            void (transferBetweenOwnAccountsDisabled && showWarningToast({ description: 'Create one more account' }))
          }>
          <FormCheckbox
            disabled={transferBetweenOwnAccountsDisabled}
            name="transferBetweenOwnAccounts"
            size={formatSize(16)}>
            <Text style={styles.checkboxText}>Transfer between my accounts</Text>
          </FormCheckbox>
        </View>
        <Divider size={formatSize(12)} />

        <Label label="Amount" description={`Set ${values.token.symbol} amount to send.`} />
        <FormNumericInput name="amount" maxValue={amountMaxValue} decimals={values.token.decimals} placeholder="0.00" />
        <Divider />
      </View>

      <View>
        <ButtonsContainer>
          <ButtonLargeSecondary title="Close" onPress={goBack} />
          <Divider size={formatSize(16)} />
          <ButtonLargePrimary title="Send" onPress={submitForm} />
        </ButtonsContainer>

        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
