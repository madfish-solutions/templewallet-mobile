import React, { memo, useCallback } from 'react';
import { StyleProp, Text, View, ViewStyle, Appearance } from 'react-native';
import { useDispatch } from 'react-redux';

import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { useInsetStyles } from 'src/hooks/use-inset-styles';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import {
  changeTheme,
  setSelectedRpcUrl,
  setFiatCurrency,
  setSlippage,
  setOnRampOverlayStateAction,
  setIsShowLoaderAction
} from 'src/store/settings/settings-actions';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { FiatCurrenciesEnum } from 'src/utils/exchange-rate.util';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { RpcList } from 'src/utils/rpc/rpc-list';

import { ButtonLargePrimary } from '../button/button-large/button-large-primary/button-large-primary';
import { ButtonMedium } from '../button/button-medium/button-medium';
import { ButtonSmallTryAgain } from '../button/button-small/button-small-try-again';
import { ButtonsContainer } from '../button/buttons-container/buttons-container';
import { Disclaimer } from '../disclaimer/disclaimer';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';

import { useErrorBoundaryContentStyles } from './content.styles';

interface ErrorBoundaryContentProps {
  error: Error;
  whileMessage?: string;
  style?: StyleProp<ViewStyle>;
  onTryAgainClick: EmptyFn;
}

export const ErrorBoundaryContent = memo<ErrorBoundaryContentProps>(
  ({ error, whileMessage, style, onTryAgainClick }) => {
    const dispatch = useDispatch();
    const errorMessage = isString(whileMessage)
      ? `Oops! Something unexpected happened while ${whileMessage}.`
      : 'Oops! Something unexpected happened.';
    const styles = useErrorBoundaryContentStyles();
    const colors = useColors();
    const insetStyles = useInsetStyles();

    const copyErrorStack = useCallback(() => copyStringToClipboard(error.stack), [error.stack]);

    const handleRevertChanges = useCallback(async () => {
      const defaultTheme = Appearance.getColorScheme() === 'dark' ? ThemesEnum.dark : ThemesEnum.light;

      dispatch(changeTheme(defaultTheme));
      dispatch(setSelectedRpcUrl(RpcList[0].url));
      dispatch(setFiatCurrency(FiatCurrenciesEnum.USD));
      dispatch(setSlippage(0.25));
      dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Closed));
      dispatch(setIsShowLoaderAction(false));

      onTryAgainClick();
    }, [dispatch, onTryAgainClick]);

    return (
      <View style={[styles.root, insetStyles, style]}>
        <View style={styles.contentWrapper}>
          <View style={styles.centerContent}>
            <Icon
              name={IconNameEnum.AlertTriangle}
              size={formatSize(90)}
              color={colors.destructive}
              style={styles.icon}
            />
            <Text style={styles.errorText}>{errorMessage} Even our app wasn't ready for that move.</Text>
            <Text style={styles.errorSubText}>{error.message ?? 'No error message'}</Text>

            <ButtonsContainer style={styles.buttonsRow}>
              {isDefined(error.stack) && (
                <ButtonSmallTryAgain
                  buttonStyle={styles.iconGap}
                  title="Copy Error"
                  iconName={IconNameEnum.Copy}
                  onPress={copyErrorStack}
                />
              )}
              <ButtonMedium
                buttonStyle={styles.retryButton}
                title="Retry"
                iconName={IconNameEnum.RetryIcon}
                onPress={onTryAgainClick}
              />
            </ButtonsContainer>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.disclaimerContainer}>
            <Disclaimer
              title="Note"
              texts={[
                'You can retry loading with last changes or roll back to default settings and get app back to normal.'
              ]}
            />
          </View>
          <View style={styles.border}>
            <ButtonLargePrimary style={styles.revertButton} title="Recover Settings" onPress={handleRevertChanges} />
          </View>
        </View>
      </View>
    );
  }
);
