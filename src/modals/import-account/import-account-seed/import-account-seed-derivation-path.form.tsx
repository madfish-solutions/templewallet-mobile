import { useFormikContext } from 'formik';
import React, { FC, useCallback } from 'react';

import { ImportAccountDerivationEnum } from 'src/enums/account-type.enum';
import { FormRadioButtonsGroup } from 'src/form/form-radio-buttons-group';
import { FormTextInput } from 'src/form/form-text-input';

import { getDefaultImportAccountSeedDerivationPath, ImportAccountSeedValues } from './import-account-seed.form';

const derivationTypeButtons = [
  { value: ImportAccountDerivationEnum.DEFAULT, label: 'Default account (the first one)' },
  { value: ImportAccountDerivationEnum.CUSTOM_PATH, label: 'Custom derivation path' }
];

interface Props {
  formValues: ImportAccountSeedValues;
}

export const ImportAccountSeedDerivationPathForm: FC<Props> = ({ formValues }) => {
  const { setFieldValue } = useFormikContext();

  const handleRadioButtonsPress = useCallback(
    (nextDerivationType: ImportAccountDerivationEnum) => {
      if (nextDerivationType === ImportAccountDerivationEnum.DEFAULT) {
        setFieldValue('derivationPath', getDefaultImportAccountSeedDerivationPath(formValues.chain));
      }
    },
    [formValues.chain, setFieldValue]
  );

  return (
    <>
      <FormRadioButtonsGroup name="derivationType" items={derivationTypeButtons} onChange={handleRadioButtonsPress} />
      {formValues.derivationType === ImportAccountDerivationEnum.CUSTOM_PATH && <FormTextInput name="derivationPath" />}
    </>
  );
};
