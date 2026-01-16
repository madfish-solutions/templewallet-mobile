import { FormikProps } from 'formik/dist/types';
import React, { useEffect, useMemo } from 'react';

import { AccountFormDropdown } from 'src/components/account-dropdown/account-form-dropdown';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormTextInput } from 'src/form/form-text-input';
import { useHdAccountListSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { getDerivationPath } from 'src/utils/keys.util';

import { RevealSeedPhraseModalFormValues } from '../reveal-seed-phrase-modal.form';
import { RevealSeedPharaseSelectors } from '../reveal-seed-phrase.selectors';

import { RevealSeedPhraseView } from './reveal-seed-phrase-view/reveal-seed-phrase-view';

export const RevealSeedPhraseFormContent: SyncFC<FormikProps<RevealSeedPhraseModalFormValues>> = ({
  values,
  setFieldValue
}) => {
  const hdAccounts = useHdAccountListSelector();

  const derivationPath = useMemo(() => {
    const currentAccountIndex = hdAccounts.findIndex(
      ({ publicKeyHash }) => publicKeyHash === values.account.publicKeyHash
    );

    return getDerivationPath(currentAccountIndex);
  }, [hdAccounts, values.account.publicKeyHash]);

  useEffect(() => void setFieldValue('derivationPath', derivationPath), [derivationPath]);

  return (
    <ScreenContainer>
      <ModalStatusBar />
      <Label
        label="Account"
        description="If you want to reveal a seed phrase from another account - you should select it in the top-right dropdown."
      />
      <AccountFormDropdown name="account" list={hdAccounts} testID={RevealSeedPharaseSelectors.accountDropdown} />
      <Label
        label="Derivation path"
        description="for HD accounts. This is the thing you use to recover all your accounts from your seed phrase."
      />
      <FormTextInput name="derivationPath" editable={false} />
      <Label
        label="Seed Phrase"
        description="If you ever switch between browsers or devices, you will need this seed phrase to access your accounts. Keep it in secret."
      />
      <RevealSeedPhraseView publicKeyHash={values.account.publicKeyHash} />
      <Divider size={formatSize(16)} />
      <Disclaimer
        title="Attention!"
        texts={['DO NOT share this set of chars with anyone!', 'It can be used to steal your current account.']}
      />
    </ScreenContainer>
  );
};
