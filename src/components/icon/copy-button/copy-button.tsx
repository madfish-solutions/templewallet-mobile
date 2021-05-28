import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { useClipboard } from '@react-native-clipboard/clipboard';
import React, { FC } from 'react';

import { useColors } from '../../../styles/use-colors';
import { Icon } from '../icon';
import { IconNameEnum } from '../icon-name.enum';
import { useCopyButtonStyles } from './copy-button.styles';

interface Props {
  value: string;
}

export const CopyButton: FC<Props> = ({ value }) => {
  const colors = useColors();
  const styles = useCopyButtonStyles();
  const [, setString] = useClipboard();

  return (
    <TouchableOpacity style={styles.container} onPress={() => setString(value)}>
      <Icon name={IconNameEnum.Copy} color={colors.blue} />
    </TouchableOpacity>
  );
};
