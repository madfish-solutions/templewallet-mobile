import { Formik } from 'formik';
import React from 'react';

import { emptyFn } from 'src/config/general';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useHDAccounts } from 'src/store/wallet/wallet-selectors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { RevealSeedPhraseFormContent } from './reveal-seed-phrase-form-content/reveal-seed-phrase-form-content';
import {
  RevealSeedPhraseModalFormValues,
  revealSeedPhraseModalValidationSchema
} from './reveal-seed-phrase-modal.form';

export const RevealSeedPhraseModal = () => {
  const hdAccounts = useHDAccounts();

  usePageAnalytic(ModalsEnum.RevealSeedPhrase);

  const revealSeedPhraseModalInitialValues: RevealSeedPhraseModalFormValues = {
    account: hdAccounts[0]
  };

  return (
    <Formik
      initialValues={revealSeedPhraseModalInitialValues}
      validationSchema={revealSeedPhraseModalValidationSchema}
      onSubmit={emptyFn}
    >
      {RevealSeedPhraseFormContent}
    </Formik>
  );
};
