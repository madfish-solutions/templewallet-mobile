import { Formik } from 'formik';
import React, { useMemo } from 'react';

import { emptyFn } from 'src/config/general';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams } from 'src/navigator/hooks/use-navigation.hook';
import { useHDAccounts, useAccount } from 'src/store/wallet/wallet-selectors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { RevealSeedPhraseFormContent } from './reveal-seed-phrase-form-content/reveal-seed-phrase-form-content';
import {
  RevealSeedPhraseModalFormValues,
  revealSeedPhraseModalValidationSchema
} from './reveal-seed-phrase-modal.form';

export const RevealSeedPhraseModal = () => {
  const selectedAccount = useAccount();
  const hdAccounts = useHDAccounts();
  const { account: accountFromRouteProps } = useModalParams<ModalsEnum.RevealSeedPhrase>();

  const account = useMemo(() => {
    const selectedHdAccount = selectedAccount.type === AccountTypeEnum.HD ? selectedAccount : hdAccounts[0];

    return accountFromRouteProps ?? selectedHdAccount;
  }, [accountFromRouteProps, hdAccounts, selectedAccount]);

  usePageAnalytic(ModalsEnum.RevealSeedPhrase);

  const RevealPrivateKeyModalInitialValues: RevealSeedPhraseModalFormValues = {
    account
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
