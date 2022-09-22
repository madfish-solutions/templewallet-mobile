import { RouteProp, useRoute } from '@react-navigation/core';
import { FormikProvider, useFormik } from 'formik';
import React, { FC, useCallback, useState } from 'react';
import { Text, View } from 'react-native';

import { templeWalletApi } from '../../../../api.service';
import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from '../../../../components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from '../../../../components/divider/divider';
import { ScreenContainer } from '../../../../components/screen-container/screen-container';
import { BlackTextLink } from '../../../../components/text-link/black-text-link';
import { TopUpInputInterface } from '../../../../interfaces/topup.interface';
import { ScreensEnum, ScreensParamList } from '../../../../navigator/enums/screens.enum';
import { useUserIdSelector } from '../../../../store/settings/settings-selectors';
import { useSelectedAccountSelector } from '../../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../../styles/format-size';
import { AnalyticsEventCategory } from '../../../../utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from '../../../../utils/analytics/use-analytics.hook';
import { isDefined } from '../../../../utils/is-defined';
import { openUrl } from '../../../../utils/linking.util';
import { TopUpFormAssetAmountInput } from '../../components/top-up-form-asset-amount-input/top-up-form-asset-amount-input';
import { useDebitStyles } from '../debit.styles';
import { AliceBobTopupFormValidationSchema, AliceBobTopupFormValues } from './alice-bob-topup.form';
import { ALICE_BOB_PRIVACY_LINK, ALICE_BOB_TERMS_OF_USE_LINK } from './config';

const hryvnia: TopUpInputInterface = {
  code: 'UAH',
  name: 'Hryvnia',
  icon: '',
  network: '',
  networkFullName: '',
  networkShortName: 'Hryvnia'
};

export const AliceBob: FC = () => {
  const { min, max } = useRoute<RouteProp<ScreensParamList, ScreensEnum.AliceBob>>().params;
  const { trackEvent } = useAnalytics();
  const { publicKeyHash } = useSelectedAccountSelector();
  const userId = useUserIdSelector();
  const styles = useDebitStyles();

  usePageAnalytic(ScreensEnum.AliceBob);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async ({ exchangeInfo }: AliceBobTopupFormValues) => {
      if (isDefined(exchangeInfo.amount)) {
        try {
          setIsLoading(true);
          trackEvent('ALICE_BOB_FORM_SUBMIT', AnalyticsEventCategory.FormSubmit, {
            amount: exchangeInfo.amount.toString()
          });

          const result = await templeWalletApi.get<{ url: string }>('/alice-bob-sign', {
            params: {
              amount: exchangeInfo.amount.toString(),
              walletAddress: publicKeyHash,
              userId
            }
          });

          setIsLoading(false);
          await openUrl(result.data.url);
        } catch {}
      }
    },
    [userId, publicKeyHash]
  );

  const formik = useFormik<AliceBobTopupFormValues>({
    initialValues: {
      exchangeInfo: {
        asset: hryvnia,
        amount: undefined,
        min,
        max
      }
    },
    validationSchema: AliceBobTopupFormValidationSchema,
    onSubmit: handleSubmit
  });

  return (
    <>
      <ScreenContainer isFullScreenMode>
        <View>
          <Divider size={formatSize(16)} />
          <FormikProvider value={formik}>
            <TopUpFormAssetAmountInput
              name="exchangeInfo"
              label="Enter total amount"
              assetsList={[hryvnia]}
              singleAsset
            />
          </FormikProvider>
        </View>
        <View>
          <View>
            <Text style={styles.termsOfUse}>By clicking Exchange you agree with</Text>
            <View style={styles.row}>
              <BlackTextLink url={ALICE_BOB_TERMS_OF_USE_LINK}>Terms of Use</BlackTextLink>
              <Divider size={formatSize(4)} />
              <Text style={styles.termsOfUse}>and</Text>
              <Divider size={formatSize(4)} />
              <BlackTextLink url={ALICE_BOB_PRIVACY_LINK}>Privacy Policy</BlackTextLink>
            </View>
          </View>
          <Divider size={formatSize(16)} />
          <Text style={styles.thirdParty}>
            The token exchange feature is provided by a third party. The Temple wallet is not responsible for the work
            of third-party services.
          </Text>
        </View>
      </ScreenContainer>
      <ButtonsFloatingContainer>
        <ButtonLargePrimary
          title={isLoading ? 'Loading...' : 'Top Up'}
          disabled={isLoading}
          onPress={formik.submitForm}
        />
      </ButtonsFloatingContainer>
    </>
  );
};
