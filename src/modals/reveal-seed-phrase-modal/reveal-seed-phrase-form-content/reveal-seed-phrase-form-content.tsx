import { FormikProps } from 'formik/dist/types';
import React, { FC, useEffect } from 'react';

import { AccountFormDropdown } from '../../../components/account-dropdown/account-form-dropdown';
import { Label } from '../../../components/label/label';
import { RevealAttention } from '../../../components/reveal-attention/reveal-attention';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { FormMnemonicInput } from '../../../form/form-mnemonic-input';
import { FormTextInput } from '../../../form/form-text-input';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { useHdAccountsListSelector } from '../../../store/wallet/wallet-selectors';
import { RevealSeedPhraseModalFormValues } from '../reveal-seed-phrase-modal.form';

export const RevealSeedPhraseFormContent: FC<FormikProps<RevealSeedPhraseModalFormValues>> = ({
  values,
  setFieldValue
}) => {
  const hdAccounts = useHdAccountsListSelector();
  const { revealSeedPhrase } = useShelter();

  useEffect(
    () =>
      revealSeedPhrase({
        successCallback: seedPhrase => setFieldValue('seedPhrase', seedPhrase)
      }),
    [values.account]
  );

  return (
    <ScreenContainer>
      <Label
        label="Account"
        description="If you want to reveal a seed phrase from another account - you should select it in the top-right dropdown."
      />
      <AccountFormDropdown name="account" list={hdAccounts} />
      <Label
        label="Derivation path"
        description="for HD acccounts. This is the thing you use to recover all your accounts from your seed phrase."
      />
      <FormTextInput name="derivationPath" />
      <Label
        label="Seed Phrase"
        description="If you ever switch between browsers or devices, you will need this seed phrase to access your accounts. Keep it in secret."
      />
      <FormMnemonicInput name="seedPhrase" />
      <RevealAttention />
    </ScreenContainer>
  );
};
