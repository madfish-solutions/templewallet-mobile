import { ParamsWithKind } from '@taquito/taquito';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { PromotionItem } from 'src/components/promotion-item';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { PromotionVariantEnum } from 'src/enums/promotion-variant.enum';
import { useIsSaplingPreparingSelector } from 'src/store/sapling';

import { InternalOperationsConfirmation } from '../internal-operations-confirmation/internal-operations-confirmation';
import { RebalanceAfterPreview } from '../rebalance-confirmation/rebalance-after-preview';
import { SaplingSendPreview } from '../sapling-send-preview/sapling-send-preview';

import { fixedStyles, useSaplingOperationsConfirmationStyles } from './sapling-operations-confirmation.styles';

interface RebalanceProps {
  variant: 'rebalance';
  opParams: ParamsWithKind[];
  amount: string;
  direction: 'shield' | 'unshield';
}

interface SendProps {
  variant: 'send';
  opParams: ParamsWithKind[];
  amount: string;
  saplingType: 'shield' | 'unshield' | 'transfer';
  modalTitle?: string;
  testID?: string;
  disclaimerMessage?: string;
}

type Props = RebalanceProps | SendProps;

export const SaplingOperationsConfirmation = (props: Props) => {
  const isPreparing = useIsSaplingPreparingSelector();
  const [isEstimationReady, setIsEstimationReady] = useState(false);
  const styles = useSaplingOperationsConfirmationStyles();

  const handleEstimationComplete = useCallback(() => setIsEstimationReady(true), []);

  const showLoader = !isEstimationReady;

  const modalTitle = props.variant === 'rebalance' ? 'Confirm Rebalance' : props.modalTitle;

  useNavigationSetOptions(
    {
      headerTitle: () => <HeaderTitle title={modalTitle ?? 'Confirm Send'} />
    },
    [modalTitle]
  );

  const renderPreview = useCallback(() => {
    if (props.variant === 'rebalance') {
      return <RebalanceAfterPreview amount={props.amount} direction={props.direction} />;
    }

    return <SaplingSendPreview amount={props.amount} saplingType={props.saplingType} />;
  }, [props]);

  return (
    <View style={fixedStyles.fill}>
      {showLoader && (
        <ScreenContainer isFullScreenMode>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loaderText}>
              Preparing your transaction.{'\n'}It could take time, usually around 1 minute.
            </Text>
          </View>

          <View style={styles.promotionContainer}>
            <PromotionItem
              id="sapling-preparation-promo"
              testID="saplingPreparationPromotion"
              pageName="SaplingPreparation"
              variant={PromotionVariantEnum.Text}
              shouldShowCloseButton
            />
          </View>
        </ScreenContainer>
      )}
      {!isPreparing && (
        <View style={showLoader ? fixedStyles.hidden : fixedStyles.fill}>
          <InternalOperationsConfirmation
            opParams={props.opParams}
            modalTitle={modalTitle}
            testID={props.variant === 'send' ? props.testID : undefined}
            disclaimerMessage={props.variant === 'send' ? props.disclaimerMessage : undefined}
            renderPreview={renderPreview}
            onEstimationComplete={handleEstimationComplete}
          />
        </View>
      )}
    </View>
  );
};
