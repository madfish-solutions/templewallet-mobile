import { useField } from 'formik';
import React, { FC } from 'react';
import { Text } from 'react-native';

import { openSecuritySettings } from 'src/biometry/biometry.utils';
import { useBiometryAvailability } from 'src/biometry/use-biometry-availability.hook';
import { Checkbox } from 'src/components/checkbox/checkbox';
import { Divider } from 'src/components/divider/divider';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';

import { useFormBiometryCheckboxStyles } from './form-biometry-checkbox.styles';

interface Props {
  name: string;
  testID?: string;
}

export const FormBiometryCheckbox: FC<Props> = ({ name, testID }) => {
  const styles = useFormBiometryCheckboxStyles();
  const [field, , helpers] = useField<boolean>(name);
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
    <Checkbox value={field.value} onChange={handleChange} inverted testID={testID}>
      <Divider size={formatSize(4)} />
      <Text style={styles.checkboxText}>Use {biometryType ?? 'Biometrics'} to unlock the app</Text>
    </Checkbox>
  ) : null;
};
