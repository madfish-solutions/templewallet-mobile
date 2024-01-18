import { useFormikContext } from 'formik';
import React, { FC, useCallback } from 'react';

import { ImportAccountDerivationEnum } from 'src/enums/account-type.enum';
import { FormRadioButtonsGroup } from 'src/form/form-radio-buttons-group';
import { FormTextInput } from 'src/form/form-text-input';
import { getDerivationPath } from 'src/utils/keys.util';

import { ImportAccountSeedValues } from './import-account-seed.form';

const derivationTypeButtons = [
  { value: ImportAccountDerivationEnum.DEFAULT, label: 'Default account (the first one)' },
  { value: ImportAccountDerivationEnum.CUSTOM_PATH, label: 'Custom derivation path' }
];

interface Props {
  formValues: ImportAccountSeedValues;
}

export const ImportAccountSeedDerivationPathForm: FC<Props> = ({ formValues }) => {
  const { setFieldValue } = useFormikContext();

  const handleRadioButtonsPress = useCallback(() => {
    if (formValues.derivationType === ImportAccountDerivationEnum.DEFAULT) {
      setFieldValue('derivationPath', getDerivationPath(0));
    }
  }, [formValues.derivationType, setFieldValue]);

  return (
    <>
      <FormRadioButtonsGroup name="derivationType" items={derivationTypeButtons} onChange={handleRadioButtonsPress} />
      {formValues.derivationType === ImportAccountDerivationEnum.CUSTOM_PATH && <FormTextInput name="derivationPath" />}
    </>
  );
};
