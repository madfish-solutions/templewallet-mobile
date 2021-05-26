import React, { FC } from 'react';
import { Text } from 'react-native';

import { useModalHeaderTitleStyles } from './modal-header-title.styles';

interface Props {
  title: string;
}

export const ModalHeaderTitle: FC<Props> = ({ title }) => {
  const styles = useModalHeaderTitleStyles();

  return <Text style={styles.title}>{title}</Text>;
};
