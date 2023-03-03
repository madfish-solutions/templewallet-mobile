import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';

import { TestIdProps } from '../../../interfaces/test-id.props';
import { useColors } from '../../../styles/use-colors';
import { openUrl } from '../../../utils/linking.util';
import { Icon } from '../icon';
import { IconNameEnum } from '../icon-name.enum';
import { useExternalLinkButtonStyles } from './external-link-button.styles';

interface Props extends TestIdProps {
  url: string;
}

export const ExternalLinkButton: FC<Props> = ({ url, testID }) => {
  const colors = useColors();
  const styles = useExternalLinkButtonStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={() => openUrl(url)}>
      <Icon name={IconNameEnum.ExternalLink} color={colors.blue} testID={testID} />
    </TouchableOpacity>
  );
};
