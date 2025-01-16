import React, { memo } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { ButtonSmallTryAgain } from '../button/button-small/button-small-try-again';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';

import { useErrorBoundaryContentStyles } from './content.styles';

interface ErrorBoundaryContentProps {
  errorMessage: string;
  style?: StyleProp<ViewStyle>;
  onTryAgainClick: EmptyFn;
}

export const ErrorBoundaryContent = memo<ErrorBoundaryContentProps>(({ errorMessage, style, onTryAgainClick }) => {
  const styles = useErrorBoundaryContentStyles();
  const colors = useColors();

  return (
    <View style={[styles.root, style]}>
      <View style={styles.content}>
        <Icon name={IconNameEnum.AlertTriangle} size={formatSize(64)} color={colors.destructive} />
        <Text style={styles.header}>Oops!</Text>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <ButtonSmallTryAgain title="Try again" onPress={onTryAgainClick} />
      </View>
    </View>
  );
});
