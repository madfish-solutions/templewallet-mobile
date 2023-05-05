import { Portal } from '@gorhom/portal';
import React from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { BottomSheetActionButton } from 'src/components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useDropdownBottomSheetStyles } from 'src/components/bottom-sheet/bottom-sheet.styles';
import { useIsOnRampPossibilitySelector } from 'src/store/settings/settings-selectors';

import { Divider } from '../../../components/divider/divider';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { setIsOnRampPossibilityAction } from '../../../store/settings/settings-actions';
import { formatSize } from '../../../styles/format-size';
import { OnRampOverlaySelectors } from './on-ramp-overlay.selectors';
import { useOnRampOverlayStyles } from './on-ramp-overlay.styles';
import { OnRampSmileButton } from './on-ramp-smile-button/on-ramp-smile-button';
import { OnRampTextButton } from './on-ramp-text-button/on-ramp-text-button';

export const OnRampOverlay = () => {
  const isOnRampPossibility = useIsOnRampPossibilitySelector();

  return isOnRampPossibility ? <OverlayComponent /> : null;
};

const OverlayComponent = () => {
  const dispatch = useDispatch();
  const styles = useOnRampOverlayStyles();
  const dropdownBottomSheetStyles = useDropdownBottomSheetStyles();

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
              <OnRampSmileButton smile="🙂" title="50$" testID={OnRampOverlaySelectors.fiftyDollarButton} />
              <Divider size={formatSize(8)} />
              <OnRampSmileButton
                smile="🤩"
                title="100$"
                style={styles.backgroundPeach}
                titleStyle={styles.textWhite}
                testID={OnRampOverlaySelectors.oneHundredDollarButton}
              />
              <Divider size={formatSize(8)} />
              <OnRampSmileButton smile="🤑" title="200$" testID={OnRampOverlaySelectors.twoHundredDollarButton} />
            </View>

            <OnRampTextButton
              title="Custom amount"
              iconName={IconNameEnum.DetailsArrowRight}
              onPress={() => 0}
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
            onPress={() => dispatch(setIsOnRampPossibilityAction(false))}
            testID={OnRampOverlaySelectors.notNowButton}
          />
        </View>
      </View>
    </Portal>
  );
};
