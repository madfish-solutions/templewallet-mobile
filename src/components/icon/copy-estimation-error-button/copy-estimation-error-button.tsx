import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';

import { white } from '../../../config/styles';
import { copyStringToClipboard } from '../../../utils/clipboard.utils';
import { Icon } from '../icon';
import { IconNameEnum } from '../icon-name.enum';
import { useCopyEstimationErrorButtonStyles } from './copy-estimation-error-button.styles';

interface Props {
  estimationError: string;
}

export const CopyEstimationErrorButton: FC<Props> = ({ estimationError }) => {
  const styles = useCopyEstimationErrorButtonStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={() => copyStringToClipboard(estimationError)}>
      <Icon name={IconNameEnum.Copy} color={white} />
    </TouchableOpacity>
  );
};
