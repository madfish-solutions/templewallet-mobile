import React, { useState } from 'react';

import { HeaderProgress } from '../../components/header/header-progress/header-progress';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { ImportAccountTypeEnum } from '../../interfaces/import-account-type';
import { ImportAccountPrivateKeyForm } from './import-account-private-key-form/import-account-private-key-form';
import { ImportAccountSeedForm } from './import-account-seed-form/import-account-seed-form';
import { ImportAccountType } from './import-account-type/import-account-type';

export const ImportAccountModal = () => {
  // TODO: спросить про useInnerScreenProgress
  useNavigationSetOptions({
    headerLeft: () => <HeaderProgress current={importAccountStep} total={2} />
  });
  const [importAccountStep, setImportAccountStep] = useState(1);
  const [importType, setImportType] = useState(ImportAccountTypeEnum.SEED_PHRASE);

  return (
    <>
      <ModalStatusBar />
      {importAccountStep === 1 && (
        <ImportAccountType
          setImportType={setImportType}
          importAccountStep={importAccountStep}
          setImportAccountStep={setImportAccountStep}
        />
      )}
      {importAccountStep === 2 && importType === ImportAccountTypeEnum.SEED_PHRASE && (
        <ImportAccountSeedForm importAccountStep={importAccountStep} setImportAccountStep={setImportAccountStep} />
      )}
      {importAccountStep === 2 && importType === ImportAccountTypeEnum.PRIVATE_KEY && (
        <ImportAccountPrivateKeyForm
          importAccountStep={importAccountStep}
          setImportAccountStep={setImportAccountStep}
        />
      )}
    </>
  );
};
