import { Formik } from 'formik';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { CheckboxLabel } from '../../../components/checkbox-description/checkbox-label';
import { Divider } from '../../../components/divider/divider';
import { HeaderButton } from '../../../components/header/header-button/header-button';
import { HeaderTitle } from '../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { TextLink } from '../../../components/text-link/text-link';
import { privacyPolicy, termsOfUse } from '../../../config/socials';
import { FormCheckbox } from '../../../form/form-checkbox';
import { FormPasswordInput } from '../../../form/form-password-input';
import { formatSize } from '../../../styles/format-size';
import {
  createNewPasswordInitialValues,
  createNewPasswordValidationSchema,
  CreateNewPasswordFormValues
} from './create-new-password.form';
import { useCreateNewPasswordStyles } from './create-new-password.styles';

type CreateNewPasswordProps = {
  onGoBackPress: () => void;
  onSubmit: (values: CreateNewPasswordFormValues) => void;
};

export const CreateNewPassword: FC<CreateNewPasswordProps> = ({ onGoBackPress, onSubmit }) => {
  const styles = useCreateNewPasswordStyles();

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderButton iconName={IconNameEnum.ArrowLeft} onPress={onGoBackPress} />,
      headerTitle: () => <HeaderTitle title="Create a new password" />
    },
    [onGoBackPress]
  );

  return (
    <Formik
      initialValues={createNewPasswordInitialValues}
      validationSchema={createNewPasswordValidationSchema}
      onSubmit={onSubmit}>
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Divider size={formatSize(12)} />
            <Label label="Password" description="A password is used to protect the wallet." />
            <FormPasswordInput name="password" />

            <Label label="Repeat Password" description="Please enter the password again." />
            <FormPasswordInput name="passwordConfirmation" />
          </View>
          <Divider />

          <View>
            <View style={styles.checkboxContainer}>
              <FormCheckbox name="acceptTerms">
                <Divider size={formatSize(8)} />
                <Text style={styles.checkboxText}>Accept terms</Text>
              </FormCheckbox>
            </View>
            <CheckboxLabel>
              I have read and agree to{'\n'}the <TextLink url={termsOfUse}>Terms of Usage</TextLink> and{' '}
              <TextLink url={privacyPolicy}>Privacy Policy</TextLink>
            </CheckboxLabel>

            <Divider />
            <ButtonLargePrimary title="Create" disabled={!isValid} onPress={submitForm} />
            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
