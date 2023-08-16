import React, { FC, useState } from 'react';
import { Text, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { BottomSheet } from 'src/components/bottom-sheet/bottom-sheet';
import { BottomSheetActionButton } from 'src/components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useDropdownBottomSheetStyles } from 'src/components/bottom-sheet/bottom-sheet.styles';
import { BottomSheetControllerProps } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { Checkbox } from 'src/components/checkbox/checkbox';
import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { setIsSwapDisclaimerShowingAction } from 'src/store/settings/settings-actions';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';

import { useSwapDisclaimerOverlayStyles } from './swap-disclaimer-overlay.styles';

interface Props extends BottomSheetControllerProps {
  routeParams?: { inputToken?: TokenInterface };
}

export const SwapDisclaimerOverlay: FC<Props> = ({ controller, routeParams }) => {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const styles = useSwapDisclaimerOverlayStyles();
  const dropdownBottomSheetStyles = useDropdownBottomSheetStyles();
  const { navigate } = useNavigation();

  const handlePress = () => {
    controller.close();
    dispatch(setIsSwapDisclaimerShowingAction(!isChecked));
    navigate(ScreensEnum.SwapScreen, routeParams);
  };

  return (
    <BottomSheet contentHeight={formatSize(isTablet() ? 313 : 353)} controller={controller} isCanselButtonShown={false}>
      <View style={[dropdownBottomSheetStyles.headerContainer, styles.paddingVertical]}>
        <Icon name={IconNameEnum.LargeSwap} size={formatSize(69)} />
        <Divider size={formatSize(16)} />

        <Text style={styles.title}>Swap tokens in-wallet</Text>
        <Divider size={formatSize(8)} />
        <Text style={[styles.description, isTablet() && styles.tabletDescriptionHeight]}>
          Swap is a native Tezos blockchain feature that enables users to exchange one token for another. It operates
          through Blockchain, automating the swap without any centralized third-parties.
        </Text>
        <Divider size={formatSize(16)} />

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={isChecked}
            size={formatSize(16)}
            strokeWidth={formatSize(2)}
            onChange={() => setIsChecked(prevState => !prevState)}
          >
            <Divider size={formatSize(4)} />
            <Text style={styles.checkboxText}>Don't show this again</Text>
          </Checkbox>
        </View>
      </View>

      <BottomSheetActionButton
        title="Got It"
        style={styles.gotItButton}
        titleStyle={styles.gotItButtonTitle}
        onPress={handlePress}
      />
    </BottomSheet>
  );
};
