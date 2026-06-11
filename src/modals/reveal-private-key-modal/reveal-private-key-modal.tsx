import { Formik } from 'formik';
import React from 'react';

import { AccountFormDropdown } from 'src/components/account-dropdown/account-form-dropdown';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { emptyFn } from 'src/config/general';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams } from 'src/navigator/hooks/use-navigation.hook';
import { useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined.ts';

import {
  RevealPrivateKeyModalFormValues,
  revealPrivateKeyModalValidationSchema
} from './reveal-private-key-modal.form';
import { RevealPrivateKeyView } from './reveal-private-key-view/reveal-private-key-view';
import { RevealPrivateKeySelectors } from './reveal-private-key.selectors';

export const RevealPrivateKeyModal = () => {
  const { account } = useModalParams<ModalsEnum.RevealPrivateKey>();

  const accounts = useAllAccounts();

  const RevealPrivateKeyModalInitialValues: RevealPrivateKeyModalFormValues = { account };

  usePageAnalytic(ModalsEnum.RevealPrivateKey);

  return (
    <Formik
      enableReinitialize={true} // (!) Might lead to unwanted form resets.
      initialValues={RevealPrivateKeyModalInitialValues}
      validationSchema={revealPrivateKeyModalValidationSchema}
      onSubmit={emptyFn}
    >
      {({ values }) => {
        const tezosAddress = getAccountAddressForTezos(values.account);
        const evmAddress = getAccountAddressForEvm(values.account);

        return (
          <ScreenContainer>
            <ModalStatusBar />
            <Label
              label="Account"
              description="If you want to reveal a private key from another account - you should select it in the top-right dropdown."
            />
            <AccountFormDropdown name="account" list={accounts} testID={RevealPrivateKeySelectors.accountDropdown} />
            {isDefined(tezosAddress) && (
              <>
                <Label label="Tezos Private Key" />
                <RevealPrivateKeyView address={tezosAddress} />
                <Divider size={formatSize(16)} />
              </>
            )}
            {isDefined(evmAddress) && (
              <>
                <Label label="EVM Private Key" />
                <RevealPrivateKeyView address={evmAddress} />
                <Divider size={formatSize(16)} />
              </>
            )}
            <Disclaimer
              title="Attention!"
              texts={['DO NOT share this set of chars with anyone!', 'It can be used to steal your current account.']}
            />
          </ScreenContainer>
        );
      }}
    </Formik>
  );
};
