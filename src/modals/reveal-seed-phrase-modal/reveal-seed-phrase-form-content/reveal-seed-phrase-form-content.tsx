import { FormikProps } from 'formik/dist/types';
import React from 'react';

import { AccountFormDropdown } from 'src/components/account-dropdown/account-form-dropdown';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { useHdAccountListSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';

import { RevealSeedPhraseModalFormValues } from '../reveal-seed-phrase-modal.form';
import { RevealSeedPharaseSelectors } from '../reveal-seed-phrase.selectors';

import { RevealSeedPhraseView } from './reveal-seed-phrase-view/reveal-seed-phrase-view';

export const RevealSeedPhraseFormContent: SyncFC<FormikProps<RevealSeedPhraseModalFormValues>> = ({ values }) => {
  const hdAccounts = useHdAccountListSelector();

  return (
    <>
      <ScreenContainer>
        <ModalStatusBar />
        <Label
          label="Account"
          description="If you want to reveal a seed phrase from another account - you should select it in the top-right dropdown."
        />
        <AccountFormDropdown name="account" list={hdAccounts} testID={RevealSeedPharaseSelectors.accountDropdown} />
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
      <InsetSubstitute type="bottom" />
    </>
  );
};
