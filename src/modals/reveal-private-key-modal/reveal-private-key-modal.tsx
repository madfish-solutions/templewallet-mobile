import { RouteProp, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';

import { AccountFormDropdown } from 'src/components/account-dropdown/account-form-dropdown';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { emptyFn } from 'src/config/general';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { useAccountsListSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import {
  RevealPrivateKeyModalFormValues,
  revealPrivateKeyModalValidationSchema
} from './reveal-private-key-modal.form';
import { RevealPrivateKeyView } from './reveal-private-key-view/reveal-private-key-view';
import { RevealPrivateKeySelectors } from './reveal-private-key.selectors';

export const RevealPrivateKeyModal = () => {
  const account = useRoute<RouteProp<ModalsParamList, ModalsEnum.RevealPrivateKey>>().params.account;

  const accounts = useAccountsListSelector();

  const RevealPrivateKeyModalInitialValues: RevealPrivateKeyModalFormValues = { account };

  usePageAnalytic(ModalsEnum.RevealPrivateKey);

  return (
    <Formik
      enableReinitialize={true} // (!) Might lead to unwanted form resets.
      initialValues={RevealPrivateKeyModalInitialValues}
      validationSchema={revealPrivateKeyModalValidationSchema}
      onSubmit={emptyFn}
    >
      {({ values }) => (
        <ScreenContainer>
          <ModalStatusBar />
          <Label
            label="Account"
            description="If you want to reveal a private key from another account - you should select it in the top-right dropdown."
          />
          <AccountFormDropdown name="account" list={accounts} testID={RevealPrivateKeySelectors.accountDropdown} />
          <Label label="Private Key" description="Current account key. Keep it in secret." />
          <RevealPrivateKeyView publicKeyHash={values.account.publicKeyHash} />
          <Divider size={formatSize(16)} />
          <Disclaimer
            title="Attention!"
            texts={['DO NOT share this set of chars with anyone!', 'It can be used to steal your current account.']}
          />
        </ScreenContainer>
      )}
    </Formik>
  );
};
