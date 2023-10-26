import { useField } from 'formik';
import React, { FC } from 'react';
import { Text } from 'react-native';

import { openSecuritySettings } from '../../biometry/biometry.utils';
import { useBiometryAvailability } from '../../biometry/use-biometry-availability.hook';
import { Checkbox } from '../../components/checkbox/checkbox';
import { Divider } from '../../components/divider/divider';
import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { ErrorMessage } from '../error-message/error-message';

import { useFormBiometryCheckboxStyles } from './form-biometry-checkbox.styles';

interface Props {
  name: string;
}

export const FormBiometryCheckbox: FC<Props> = ({ name }) => {
  const styles = useFormBiometryCheckboxStyles();
  const [field, meta, helpers] = useField<boolean>(name);
  const { isHardwareAvailable, biometryType } = useBiometryAvailability();

  const handleChange = (newValue: boolean) => {
    if (isDefined(biometryType)) {
      helpers.setTouched(true);
      helpers.setValue(newValue);
    } else {
      openSecuritySettings();
    }
  };

  return isHardwareAvailable ? (
    <>
      <Checkbox value={field.value} onChange={handleChange}>
        <Divider size={formatSize(8)} />
        <Text style={styles.checkboxText}>Use {biometryType ?? 'Biometrics'} to unlock the app</Text>
      </Checkbox>
      <ErrorMessage meta={meta} />
    </>
  ) : null;
};
