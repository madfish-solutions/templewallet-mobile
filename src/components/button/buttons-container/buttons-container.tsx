import React, { FC } from 'react';
import { View } from 'react-native';

import { ButtonsContainerStyles } from './buttons-container.styles';

export const ButtonsContainer: FC = ({ children }) => <View style={ButtonsContainerStyles.container}>{children}</View>;
