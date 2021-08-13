import { FormikProps } from 'formik';
import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { AccountFormDropdown } from '../../../components/account-dropdown/account-form-dropdown';
import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../../components/button/buttons-container/buttons-container';
import { Divider } from '../../../components/divider/divider';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { ModalStatusBar } from '../../../components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { FormAddressInput } from '../../../form/form-address-input';
import { FormAssetAmountInput } from '../../../form/form-asset-amount-input';
import { FormCheckbox } from '../../../form/form-checkbox';
import { WalletAccountInterface } from '../../../interfaces/wallet-account.interface';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { showWarningToast } from '../../../toast/toast.utils';
import { TokenInterface } from '../../../token/interfaces/token.interface';
import { SendModalFormValues } from '../send-modal.form';
import { useSendModalContentStyles } from './send-modal-content.styles';

interface Props extends Pick<FormikProps<SendModalFormValues>, 'values' | 'submitForm'> {
  ownAccountsReceivers: WalletAccountInterface[];
  tokensList: TokenInterface[];
  initialAsset: TokenInterface;
}

export const SendModalContent: FC<Props> = ({ initialAsset, values, submitForm, tokensList, ownAccountsReceivers }) => {
  const { goBack } = useNavigation();
  const styles = useSendModalContentStyles();

  const transferBetweenOwnAccountsDisabled = ownAccountsReceivers.length === 0;

  const defaultValue = useMemo(
    () => ({
      token: initialAsset
    }),
    [initialAsset]
  );

  return (
    <ScreenContainer isFullScreenMode={true}>
      <ModalStatusBar />
      <View>
        <FormAssetAmountInput name="amount" title="Amount" tokens={tokensList} defaultValue={defaultValue} />
        <Divider size={formatSize(32)} />

        <Label label="To" description={`Address or Tezos domain to send ${values.amount?.token.symbol} funds to.`} />
        {values.transferBetweenOwnAccounts ? (
          <AccountFormDropdown name="ownAccount" list={ownAccountsReceivers} />
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
