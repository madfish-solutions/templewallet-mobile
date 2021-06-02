import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { TouchableOpacityProps } from 'react-native';

import { WhiteContainerActionStyles } from './white-container-action.styles';

type Props = Pick<TouchableOpacityProps, 'disabled' | 'onPress'>;

export const WhiteContainerAction: FC<Props> = ({ disabled, onPress, children }) => {
  return (
    <TouchableOpacity style={WhiteContainerActionStyles.container} disabled={disabled} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};
