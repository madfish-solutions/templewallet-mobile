import { black } from '../../../../../config/styles';
import { createUseStyles } from '../../../../../styles/create-use-styles';
import { formatSize } from '../../../../../styles/format-size';
import { generateShadow } from '../../../../../styles/generate-shadow';

export const useOperationsPreviewItemStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    ...generateShadow(1, black),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: formatSize(8),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  description: {
    ...typography.caption13Regular,
    color: colors.black
  }
}));
