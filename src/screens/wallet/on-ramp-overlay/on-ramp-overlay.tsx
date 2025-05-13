import React, { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { BottomSheet } from 'src/components/bottom-sheet/bottom-sheet';
import { useDropdownBottomSheetStyles } from 'src/components/bottom-sheet/bottom-sheet.styles';
import { useBottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';
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

interface OnRampOverlayProps extends OverlayBodyProps {
  isOpen: boolean;
  onClose: EmptyFn;
}

const OverlayBody = memo<OverlayBodyProps>(({ isStart }) => {
  const [isLinkLoading, setIsLinkLoading] = useState(false);

  const styles = useOnRampOverlayStyles();
  const dropdownBottomSheetStyles = useDropdownBottomSheetStyles();
  const dispatch = useDispatch();
  const publicKeyHash = useCurrentAccountPkhSelector();

  const handleClose = useCallback(() => {
    setIsLinkLoading(false);
    dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Closed));
  }, [dispatch]);

  const handleOnRampButtonPress = useCallback(
    async (amount = 0) => {
      try {
        setIsLinkLoading(true);

        const url = await getWertLink(publicKeyHash, amount);

        handleClose();

        openUrl(url);
      } catch {
        handleClose();
      }
    },
    [handleClose, publicKeyHash]
  );

  return (
    <TouchableOpacity style={[dropdownBottomSheetStyles.headerContainer, styles.root]}>
      {isLinkLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <Text style={styles.title}>{isStart ? 'Jump in Tezos right now!' : 'Insufficient TEZ balance'}</Text>
          <Divider size={formatSize(8)} />
          {isStart ? (
            <Text style={styles.description}>
              Buy TEZ using <Text style={styles.bold}>credit card</Text> and start working with the Tezos blockchain
              immediately.
            </Text>
          ) : (
            <Text style={styles.description}>
              Buy TEZ using <Text style={styles.bold}>credit card</Text> and continue your Tezos blockchain journey
              without delay.
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
        </>
      )}
    </TouchableOpacity>
  );
});

export const OnRampOverlay: FC<OnRampOverlayProps> = ({ isOpen, isStart, onClose }) => {
  const bottomSheetController = useBottomSheetController();
  const isInitiallyOpenRef = useRef(isOpen);

  useEffect(() => {
    if (isOpen) {
      bottomSheetController.open();

      return () => bottomSheetController.close();
    }

    bottomSheetController.close();
  }, [bottomSheetController, isOpen]);

  return (
    <BottomSheet
      contentHeight={formatSize(352)}
      controller={bottomSheetController}
      cancelButtonText="Not now"
      cancelButtonTestID={OnRampOverlaySelectors.notNowButton}
      isInitiallyOpen={isInitiallyOpenRef.current}
      onCancelButtonPress={onClose}
      onClose={onClose}
    >
      <OverlayBody isStart={isStart} />
    </BottomSheet>
  );
};
