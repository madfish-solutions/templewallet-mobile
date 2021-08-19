import { RouteProp, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';

import { emptyFn } from '../../config/general';
import { AccountTypeEnum } from '../../enums/account-type.enum';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useHdAccountListSelector, useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { RevealSeedPhraseFormContent } from './reveal-seed-phrase-form-content/reveal-seed-phrase-form-content';
import {
  RevealSeedPhraseModalFormValues,
  revealSeedPhraseModalValidationSchema
} from './reveal-seed-phrase-modal.form';

export const RevealSeedPhraseModal = () => {
  const selectedAccount = useSelectedAccountSelector();
  const hdAccounts = useHdAccountListSelector();
  const selectedHdAccount = selectedAccount.type === AccountTypeEnum.IMPORTED_ACCOUNT ? hdAccounts[0] : selectedAccount;
  const account =
    useRoute<RouteProp<ModalsParamList, ModalsEnum.RevealSeedPhrase>>().params.account ?? selectedHdAccount;

  const RevealPrivateKeyModalInitialValues: RevealSeedPhraseModalFormValues = {
    account,
    derivationPath: ''
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={RevealPrivateKeyModalInitialValues}
      validationSchema={revealSeedPhraseModalValidationSchema}
      onSubmit={emptyFn}>
      {RevealSeedPhraseFormContent}
    </Formik>
  );
};
