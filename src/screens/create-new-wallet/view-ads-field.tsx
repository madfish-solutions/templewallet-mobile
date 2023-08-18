import React, { FC, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { CheckboxLabel } from 'src/components/checkbox-description/checkbox-label';
import { Divider } from 'src/components/divider/divider';
import { FormCheckbox } from 'src/form/form-checkbox';
import { setIsAnalyticsEnabled } from 'src/store/settings/settings-actions';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';

export const ViewAdsField: FC<{ enabled: boolean; testID?: string }> = ({ enabled, testID }) => {
  const styles = useSetPasswordScreensCommonStyles();

  const dispatch = useDispatch();

  useEffect(() => void dispatch(setIsAnalyticsEnabled(enabled)), [enabled, dispatch]);

  return (
    <>
      <View style={[styles.checkboxContainer, styles.removeMargin]}>
        <FormCheckbox name="viewAds" testID={testID}>
          <Divider size={formatSize(8)} />
          <Text style={styles.checkboxText}>View Ads</Text>
        </FormCheckbox>
      </View>
      <CheckboxLabel>
        I agree to share data(wallet address, IP) and get cashback at Temple Keys for viewing ads
      </CheckboxLabel>
    </>
  );
};
