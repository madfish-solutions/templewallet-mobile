import React, { memo, useCallback } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';

import { ButtonMedium } from '../button/button-medium/button-medium';
import { ButtonSmallTryAgain } from '../button/button-small/button-small-try-again';
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
    const errorMessage = isString(whileMessage) ? `Something went wrong while ${whileMessage}` : 'Something went wrong';
    const styles = useErrorBoundaryContentStyles();
    const colors = useColors();

    const copyErrorStack = useCallback(() => copyStringToClipboard(error.stack), []);

    return (
      <View style={[styles.root, style]}>
        <View style={styles.content}>
          <Icon name={IconNameEnum.AlertTriangle} size={formatSize(64)} color={colors.destructive} />
          <Text style={styles.header}>Oops!</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Text style={styles.errorText}>{error.message ?? 'No error message'}</Text>
          <ButtonSmallTryAgain title="Try again" onPress={onTryAgainClick} />
          {isDefined(error.stack) && (
            <ButtonMedium title="Copy error stack" iconName={IconNameEnum.Copy} onPress={copyErrorStack} />
          )}
        </View>
      </View>
    );
  }
);
