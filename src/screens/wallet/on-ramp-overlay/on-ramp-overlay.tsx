import { Portal } from '@gorhom/portal';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { BottomSheetActionButton } from 'src/components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useDropdownBottomSheetStyles } from 'src/components/bottom-sheet/bottom-sheet.styles';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { setIsOnRampHasBeenShownBeforeAction, setOnRampPossibilityAction } from 'src/store/settings/settings-actions';
import { useIsOnRampPossibilitySelector } from 'src/store/settings/settings-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { openUrl } from 'src/utils/linking';

import { OnRampOverlaySelectors } from './on-ramp-overlay.selectors';
import { useOnRampOverlayStyles } from './on-ramp-overlay.styles';
import { OnRampSmileButton } from './on-ramp-smile-button/on-ramp-smile-button';
import { OnRampTextButton } from './on-ramp-text-button/on-ramp-text-button';
import { getWertLink } from './utils/get-wert-link.util';

export const OnRampOverlay: FC = () => {
  const isOnRampPossibility = useIsOnRampPossibilitySelector();

  return isOnRampPossibility ? <OverlayComponent /> : null;
};

const OverlayComponent = () => {
  const dispatch = useDispatch();
  const { publicKeyHash } = useSelectedAccountSelector();
  const styles = useOnRampOverlayStyles();
  const dropdownBottomSheetStyles = useDropdownBottomSheetStyles();

  const handleOnRampButtonPress = (amount = 0) => {
    dispatch(setOnRampPossibilityAction(false));
    dispatch(setIsOnRampHasBeenShownBeforeAction(true));
    openUrl(getWertLink(publicKeyHash, amount));
  };

  return (
    <Portal>
      <View style={styles.backdrop}>
        <View style={[dropdownBottomSheetStyles.root, styles.root]}>
          <View style={dropdownBottomSheetStyles.headerContainer}>
            <Text style={styles.title}>Jump in Tezos right now!</Text>
            <Divider size={formatSize(8)} />
            <Text style={styles.description}>
              Buy TEZ using <Text style={styles.bold}>credit card</Text> and start working with the Tezos blockchain
              immediately.
            </Text>

            <View style={styles.buttonsContainer}>
              <OnRampSmileButton
                smileIconName={IconNameEnum.Smile}
                title="50$"
                onPress={() => handleOnRampButtonPress(50)}
                testID={OnRampOverlaySelectors.fiftyDollarButton}
              />
              <Divider size={formatSize(8)} />
              <OnRampSmileButton
                smileIconName={IconNameEnum.SmileWithGlasses}
                title="100$"
                style={styles.backgroundPeach}
                titleStyle={styles.textWhite}
                onPress={() => handleOnRampButtonPress(100)}
                testID={OnRampOverlaySelectors.oneHundredDollarButton}
              />
              <Divider size={formatSize(8)} />
              <OnRampSmileButton
                smileIconName={IconNameEnum.SmileWithDollar}
                title="200$"
                onPress={() => handleOnRampButtonPress(200)}
                testID={OnRampOverlaySelectors.twoHundredDollarButton}
              />
            </View>

            <OnRampTextButton
              title="Custom amount"
              iconName={IconNameEnum.DetailsArrowRight}
              onPress={() => handleOnRampButtonPress()}
              testID={OnRampOverlaySelectors.customAmountButton}
            />

            <Divider size={formatSize(24)} />

            <Text style={[styles.description, styles.disclaimer]}>
              The token exchange feature is provided by third-party.
            </Text>
          </View>

          <BottomSheetActionButton
            title="Not now"
            style={styles.notNowButton}
            titleStyle={styles.notNowButtonTitle}
            onPress={() => dispatch(setOnRampPossibilityAction(false))}
            testID={OnRampOverlaySelectors.notNowButton}
          />
        </View>
      </View>
    </Portal>
  );
};
