import { RouteProp, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';

import { emptyFn } from '../../config/general';
import { ModalsEnum, ModalsParamList } from '../../navigator/modals.enum';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { RevealSeedPhraseFormContent } from './reveal-seed-phrase-form-content/reveal-seed-phrase-form-content';
import {
  RevealSeedPhraseModalFormValues,
  revealSeedPhraseModalValidationSchema
} from './reveal-seed-phrase-modal.form';

export const RevealSeedPhraseModal = () => {
  const selectedAccount = useSelectedAccountSelector();
  const account = useRoute<RouteProp<ModalsParamList, ModalsEnum.RevealSeedPhrase>>().params.account ?? selectedAccount;

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
