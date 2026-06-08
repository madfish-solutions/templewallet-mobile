import React from 'react';

import { FormTextInput } from 'src/form/form-text-input';

import { ImportAccountSeedSelectors } from './import-account-seed.selectors';

export const ImportAccountSeedDerivationPathForm = () => (
  <FormTextInput
    name="derivationPath"
    placeholder="e.g. m/44'/60'/0'/0/0"
    testID={ImportAccountSeedSelectors.derivationPathInput}
  />
);
