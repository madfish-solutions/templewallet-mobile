import React, { FC } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { WhiteContainerActionStyles } from './white-container-action.styles';

type Props = Pick<TouchableOpacityProps, 'disabled' | 'onPress'>;

export const WhiteContainerAction: FC<Props> = ({ disabled, onPress, children }) => (
  <TouchableOpacity style={WhiteContainerActionStyles.container} disabled={disabled} onPress={onPress}>
    {children}
  </TouchableOpacity>
);
