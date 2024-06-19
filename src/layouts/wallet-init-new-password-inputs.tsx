import { useFormik } from 'formik';
import React, { memo } from 'react';
import { View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { FormPasswordInput } from 'src/form/form-password-input';
import { formatSize } from 'src/styles/format-size';

import {
  WalletInitFinalStepInputs,
  WalletInitFinalStepInputsProps,
  WalletInitFormValuesBase
} from './wallet-init-final-step-inputs';

interface WalletInitNewPasswordFormValues extends WalletInitFormValuesBase {
  password: string;
  passwordConfirmation: string;
}

interface WalletInitNewPasswordInputsProps
  extends Omit<WalletInitFinalStepInputsProps<WalletInitNewPasswordFormValues>, 'formik'> {
  formik: ReturnType<typeof useFormik<WalletInitNewPasswordFormValues>>;
  passwordInputTestID: string;
  repeatPasswordInputTestID: string;
}

export const WalletInitNewPasswordInputs = memo<WalletInitNewPasswordInputsProps>(
  ({ passwordInputTestID, repeatPasswordInputTestID, ...restProps }) => (
    <WalletInitFinalStepInputs {...restProps}>
      <Divider size={formatSize(16)} />
      <View>
        <Label label="Password" description="A password is used to protect the wallet." />
        <FormPasswordInput isShowPasswordStrengthIndicator name="password" testID={passwordInputTestID} />
      </View>

      <Label label="Repeat Password" description="Please enter the password again." />
      <FormPasswordInput name="passwordConfirmation" testID={repeatPasswordInputTestID} />
    </WalletInitFinalStepInputs>
  )
);
