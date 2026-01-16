import { RouteProp, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useMemo } from 'react';

import { emptyFn } from 'src/config/general';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { useHdAccountListSelector, useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { RevealSeedPhraseFormContent } from './reveal-seed-phrase-form-content/reveal-seed-phrase-form-content';
import {
  RevealSeedPhraseModalFormValues,
  revealSeedPhraseModalValidationSchema
} from './reveal-seed-phrase-modal.form';

export const RevealSeedPhraseModal = () => {
  const selectedAccount = useSelectedAccountSelector();
  const hdAccounts = useHdAccountListSelector();
  const accountFromRouteProps = useRoute<RouteProp<ModalsParamList, ModalsEnum.RevealSeedPhrase>>().params.account;

  const account = useMemo(() => {
    const selectedHdAccount =
      selectedAccount.type === AccountTypeEnum.IMPORTED_ACCOUNT ? hdAccounts[0] : selectedAccount;

    return accountFromRouteProps ?? selectedHdAccount;
  }, []);

  usePageAnalytic(ModalsEnum.RevealSeedPhrase);

  const RevealPrivateKeyModalInitialValues: RevealSeedPhraseModalFormValues = {
    account,
    derivationPath: ''
  };

  return (
    <Formik
      initialValues={RevealPrivateKeyModalInitialValues}
      validationSchema={revealSeedPhraseModalValidationSchema}
      onSubmit={emptyFn}
    >
      {RevealSeedPhraseFormContent}
    </Formik>
  );
};
