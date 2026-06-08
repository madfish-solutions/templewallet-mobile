import React from 'react';

import { FormTextInput } from 'src/form/form-text-input';

import { importAccountSeedDerivationPathPlaceholder } from './import-account-seed.form';
import { ImportAccountSeedSelectors } from './import-account-seed.selectors';

export const ImportAccountSeedDerivationPathForm = () => (
  <FormTextInput
    name="derivationPath"
    placeholder={importAccountSeedDerivationPathPlaceholder}
    testID={ImportAccountSeedSelectors.derivationPathInput}
  />
);
