import React, { FC, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { CheckboxLabel } from 'src/components/checkbox-description/checkbox-label';
import { Divider } from 'src/components/divider/divider';
import { TextLink } from 'src/components/text-link/text-link';
import { analyticsCollecting } from 'src/config/socials';
import { FormCheckbox } from 'src/form/form-checkbox';
import { setIsAnalyticsEnabled } from 'src/store/settings/settings-actions';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';

import { CreateNewWalletSelectors } from './create-new-wallet.selectors';

export const AnalyticsField: FC<{ enabled: boolean }> = ({ enabled }) => {
  const styles = useSetPasswordScreensCommonStyles();

  const dispatch = useDispatch();

  useEffect(() => void dispatch(setIsAnalyticsEnabled(enabled)), [enabled, dispatch]);

  return (
    <>
      <View style={[styles.checkboxContainer, styles.removeMargin]}>
        <FormCheckbox name="analytics" testID={CreateNewWalletSelectors.analyticsCheckbox}>
          <Divider size={formatSize(8)} />
          <Text style={styles.checkboxText}>Analytics</Text>
        </FormCheckbox>
      </View>
      <CheckboxLabel>
        I agree to the <TextLink url={analyticsCollecting}>anonymous information collecting</TextLink>
      </CheckboxLabel>
    </>
  );
};
