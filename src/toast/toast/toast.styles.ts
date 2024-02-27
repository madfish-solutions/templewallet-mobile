import { black } from '../../config/styles';
import { zIndexEnum } from '../../enums/z-index.enum';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize, formatTextSize } from '../../styles/format-size';
import { generateShadow } from '../../styles/generate-shadow';

export const useToastStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    ...generateShadow(1, black),
    zIndex: zIndexEnum.Toast,
    width: formatSize(343),
    borderRadius: formatSize(8),
    backgroundColor: colors.white
  },
  overlay: {
    borderRadius: formatSize(8),
    flex: 1,
    justifyContent: 'center'
  },
  innerContent: {
    flexDirection: 'row'
  },
  title: {
    ...typography.caption13Semibold
  },
  description: {
    ...typography.caption13Regular,
    lineHeight: formatTextSize(18)
  },
  textWrapper: {
    flex: 1,
    marginVertical: 10
  },
  row: {
    flexDirection: 'row'
  },
  iconLeft: {
    marginTop: formatSize(11),
    marginHorizontal: formatSize(8)
  },
  copyIconContainer: {
    padding: formatSize(4),
    marginLeft: formatSize(4),
    borderRadius: formatSize(4)
  }
}));
