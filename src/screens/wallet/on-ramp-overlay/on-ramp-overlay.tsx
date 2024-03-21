import { useIsFocused } from '@react-navigation/native';
import React, { memo, useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { BottomSheet } from 'src/components/bottom-sheet/bottom-sheet';
import { useDropdownBottomSheetStyles } from 'src/components/bottom-sheet/bottom-sheet.styles';
import { useBottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { setOnRampOverlayStateAction, setStartModalAllowedAction } from 'src/store/settings/settings-actions';
import { useOnRampOverlayStateSelector, useStartModalAllowedSelector } from 'src/store/settings/settings-selectors';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { openUrl } from 'src/utils/linking';

import { OnRampOverlaySelectors } from './on-ramp-overlay.selectors';
import { useOnRampOverlayStyles } from './on-ramp-overlay.styles';
import { OnRampSmileButton } from './on-ramp-smile-button/on-ramp-smile-button';
import { OnRampTextButton } from './on-ramp-text-button/on-ramp-text-button';
import { getWertLink } from './utils/get-wert-link.util';

interface OverlayBodyProps {
  isStart: boolean;
}

const OverlayBody = memo<OverlayBodyProps>(({ isStart }) => {
  const styles = useOnRampOverlayStyles();
  const dropdownBottomSheetStyles = useDropdownBottomSheetStyles();
  const dispatch = useDispatch();
  const publicKeyHash = useCurrentAccountPkhSelector();

  const handleOnRampButtonPress = useCallback(
    (amount = 0) => {
      dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Closed));
      openUrl(getWertLink(publicKeyHash, amount));
    },
    [dispatch, publicKeyHash]
  );

  return (
    <View style={dropdownBottomSheetStyles.headerContainer}>
      <Text style={styles.title}>{isStart ? 'Jump in Tezos right now!' : 'Insufficient TEZ balance'}</Text>
      <Divider size={formatSize(8)} />
      {isStart ? (
        <Text style={styles.description}>
          Buy TEZ using <Text style={styles.bold}>credit card</Text> and start working with the Tezos blockchain
          immediately.
        </Text>
      ) : (
        <Text style={styles.description}>
          Buy TEZ using <Text style={styles.bold}>credit card</Text> and continue your Tezos blockchain journey without
          delay.
        </Text>
      )}

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
  );
});

export const OnRampOverlay = () => {
  const bottomSheetController = useBottomSheetController();
  const onRampOverlayState = useOnRampOverlayStateSelector();
  const startModalAllowed = useStartModalAllowedSelector();
  const dispatch = useDispatch();
  const isStart = onRampOverlayState === OnRampOverlayState.Start;
  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused &&
    (onRampOverlayState === OnRampOverlayState.Continue ||
      (onRampOverlayState === OnRampOverlayState.Start && startModalAllowed))
      ? bottomSheetController.open()
      : bottomSheetController.close();
  }, [bottomSheetController, isFocused, onRampOverlayState, startModalAllowed]);

  const handleCancel = useCallback(() => {
    dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Closed));
    dispatch(setStartModalAllowedAction(false));
  }, [dispatch]);

  return (
    <BottomSheet
      contentHeight={formatSize(352)}
      controller={bottomSheetController}
      cancelButtonText="Not now"
      cancelButtonTestID={OnRampOverlaySelectors.notNowButton}
      onCancelButtonPress={handleCancel}
      onClose={handleCancel}
    >
      <OverlayBody isStart={isStart} />
    </BottomSheet>
  );
};
