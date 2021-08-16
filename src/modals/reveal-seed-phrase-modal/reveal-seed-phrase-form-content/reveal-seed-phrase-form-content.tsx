import { FormikProps } from 'formik/dist/types';
import React, { FC, useEffect, useMemo } from 'react';

import { AccountFormDropdown } from '../../../components/account-dropdown/account-form-dropdown';
import { Divider } from '../../../components/divider/divider';
import { Label } from '../../../components/label/label';
import { ModalStatusBar } from '../../../components/modal-status-bar/modal-status-bar';
import { RevealAttention } from '../../../components/reveal-attention/reveal-attention';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { FormTextInput } from '../../../form/form-text-input';
import { useHdAccountListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { getDerivationPath } from '../../../utils/keys.util';
import { RevealSeedPhraseModalFormValues } from '../reveal-seed-phrase-modal.form';
import { RevealSeedPhraseView } from './reveal-seed-phrase-view/reveal-seed-phrase-view';

export const RevealSeedPhraseFormContent: FC<FormikProps<RevealSeedPhraseModalFormValues>> = ({
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

  useEffect(() => setFieldValue('derivationPath', derivationPath), [derivationPath]);

  return (
    <ScreenContainer>
      <ModalStatusBar />
      <Label
        label="Account"
        description="If you want to reveal a seed phrase from another account - you should select it in the top-right dropdown."
      />
      <AccountFormDropdown name="account" list={hdAccounts} />
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
      <RevealAttention />
    </ScreenContainer>
  );
};
