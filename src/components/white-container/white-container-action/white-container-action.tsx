import React, { FC } from 'react';
import { TouchableOpacityProps } from 'react-native';

import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { setTestID } from 'src/utils/test-id.utils';

import { WhiteContainerActionStyles } from './white-container-action.styles';

type Props = Pick<TouchableOpacityProps, 'disabled' | 'onPress'> & TestIdProps;

export const WhiteContainerAction: FC<Props> = ({ disabled, onPress, children, testID, testIDProperties }) => (
  <TouchableWithAnalytics
    style={WhiteContainerActionStyles.container}
    disabled={disabled}
    onPress={onPress}
    testIDProperties={testIDProperties}
    {...setTestID(testID)}
  >
    {children}
  </TouchableWithAnalytics>
);
