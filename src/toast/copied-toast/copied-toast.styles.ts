import { black } from 'src/config/styles';
import { zIndexEnum } from 'src/enums/z-index.enum';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useCopiedToastStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    ...generateShadow(1, black),
    zIndex: zIndexEnum.Toast,
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
