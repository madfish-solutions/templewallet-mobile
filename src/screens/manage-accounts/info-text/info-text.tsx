import React from 'react';
import { Text } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { formatSize } from '../../../styles/format-size';

import { useInfoTextStyles } from './info-text.styles';

export const InfoText = () => {
  const styles = useInfoTextStyles();

  return (
    <>
      <Text style={styles.text}>
        If you ever switch between browsers or devices, you will need this seed phrase to access your accounts.
      </Text>
      <Divider size={formatSize(16)} />
    </>
  );
};
