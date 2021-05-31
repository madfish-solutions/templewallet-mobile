import { FormikProps } from 'formik/dist/types';
import React, { FC, useEffect } from 'react';

import { AccountFormDropdown } from '../../../components/account-dropdown/account-form-dropdown';
import { Label } from '../../../components/label/label';
import { RevealAttention } from '../../../components/reveal-attention/reveal-attention';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { FormMnemonicInput } from '../../../form/form-mnemonic-input';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { useHdAccountsListSelector } from '../../../store/wallet/wallet-selectors';
import { RevealPrivateKeyModalFormValues } from '../reveal-private-key-modal.form';

export const RevealPrivateKeyFormContent: FC<FormikProps<RevealPrivateKeyModalFormValues>> = ({
  values,
  setFieldValue
}) => {
  const hdAccounts = useHdAccountsListSelector();
  const { revealSecretKey } = useShelter();

  useEffect(
    () =>
      revealSecretKey({
        publicKeyHash: values.account.publicKeyHash,
        successCallback: privateKey => setFieldValue('privateKey', privateKey)
      }),
    [values.account]
  );

  return (
    <ScreenContainer>
      <Label
        label="Account"
        description="If you want to reveal a private key from another account - you should select it in the top-right dropdown."
      />
      <AccountFormDropdown name="account" list={hdAccounts} />
      <Label label="Private Key" description="Current account key. Keep it in secret." />
      <FormMnemonicInput name="privateKey" />
      <RevealAttention />
    </ScreenContainer>
  );
};
