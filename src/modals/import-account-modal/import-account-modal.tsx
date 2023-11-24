import React, { useState } from 'react';

import { HeaderProgress } from '../../components/header/header-progress/header-progress';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { ImportAccountTypeEnum } from '../../enums/account-type.enum';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';

import { ImportAccountPrivateKey } from './import-account-private-key/import-account-private-key';
import { ImportAccountSeed } from './import-account-seed/import-account-seed';
import { ImportAccountType } from './import-account-type/import-account-type';

export const ImportAccountModal = () => {
  const [importAccountStep, setImportAccountStep] = useState(1);
  const [importType, setImportType] = useState(ImportAccountTypeEnum.SEED_PHRASE);

  usePageAnalytic(ModalsEnum.ImportAccount);

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderProgress current={importAccountStep} total={2} />
    },
    [importAccountStep]
  );

  const onSubmit = (type: ImportAccountTypeEnum) => {
    setImportType(type);
    setImportAccountStep(importAccountStep + 1);
  };

  const onBackHandler = () => setImportAccountStep(importAccountStep - 1);

  return (
    <>
      <ModalStatusBar />
      {importAccountStep === 1 && <ImportAccountType onSubmit={onSubmit} />}
      {importAccountStep === 2 && importType === ImportAccountTypeEnum.SEED_PHRASE && (
        <ImportAccountSeed onBackHandler={onBackHandler} />
      )}
      {importAccountStep === 2 && importType === ImportAccountTypeEnum.PRIVATE_KEY && (
        <ImportAccountPrivateKey onBackHandler={onBackHandler} />
      )}
    </>
  );
};
