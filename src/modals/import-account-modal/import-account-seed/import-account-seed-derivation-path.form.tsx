import { useFormikContext } from 'formik';
import React, { FC, useEffect } from 'react';

import { ImportAccountDerivationEnum } from '../../../enums/account-type.enum';
import { FormRadioButtonsGroup } from '../../../form/form-radio-buttons-group';
import { FormTextInput } from '../../../form/form-text-input';
import { getDerivationPath } from '../../../utils/keys.util';
import { ImportAccountSeedValues } from './import-account-seed.form';

const derivationTypeButtons = [
  { value: ImportAccountDerivationEnum.DEFAULT, label: 'Default account (the first one)' },
  { value: ImportAccountDerivationEnum.CUSTOM_PATH, label: 'Custom derivation path' }
];

interface Props {
  formValues: ImportAccountSeedValues;
}

export const ImportAccountSeedDerivationPathForm: FC<Props> = ({ formValues }) => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (formValues.derivationType === ImportAccountDerivationEnum.DEFAULT) {
      setFieldValue('derivationPath', getDerivationPath(0));
    }
  }, [values]);

  return (
    <>
      <FormRadioButtonsGroup name="derivationType" items={derivationTypeButtons} />
      {formValues.derivationType === ImportAccountDerivationEnum.CUSTOM_PATH && <FormTextInput name="derivationPath" />}
    </>
  );
};
