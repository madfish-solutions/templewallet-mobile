import { black } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { generateShadow } from '../../styles/generate-shadow';

export const useCopiedToastStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    ...generateShadow(1, black),
    justifyContent: 'center',
    alignItems: 'center',
    width: formatSize(264),
    height: formatSize(44),
    borderRadius: formatSize(22),
    backgroundColor: colors.cardBG
  },
  text: {
    ...typography.body15Semibold,
    color: colors.gray1
  }
}));
