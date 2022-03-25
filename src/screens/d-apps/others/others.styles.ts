import { Dimensions } from 'react-native';

import { black } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';
import { generateShadow } from '../../../styles/generate-shadow';

const width = Dimensions.get('window').width - 40;

export const useOthersDAppStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    ...generateShadow(1, black),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG,
    flexDirection: 'row',
    alignItems: 'center',
    padding: formatSize(16),
    marginRight: formatSize(16),
    marginBottom: formatSize(16),
    width: width / 2 - 5
  },
  text: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  logo: {
    width: formatSize(24),
    height: formatSize(24),
    borderRadius: formatSize(100)
  }
}));
