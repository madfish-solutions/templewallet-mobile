import { black } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { generateShadow } from '../../styles/generate-shadow';

export const useWarningBlockStyles = createUseStyles(({ colors, typography }) => ({
  warningBlockWrapper: {
    ...generateShadow(1, black),
    width: formatSize(343),
    borderRadius: formatSize(8),
    backgroundColor: colors.white
  },
  innerContent: {
    flexDirection: 'row'
  },
  iconLeft: {
    margin: formatSize(10)
  },
  textWrapper: {
    flex: 1,
    marginVertical: 10
  },
  description: {
    ...typography.caption13Regular,
    lineHeight: formatSize(20)
  },
  textStyle: {
    paddingRight: formatSize(20),
    color: colors.black
  }
}));
