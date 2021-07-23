import { black } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { generateShadow } from '../../styles/generate-shadow';

export const useToastStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    ...generateShadow(1, black),
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
    lineHeight: formatSize(20)
  },
  textWrapper: {
    flex: 1,
    marginVertical: 10
  },
  operationHashBlock: {
    flexDirection: 'row'
  },
  iconLeft: {
    margin: formatSize(10)
  },
  iconRight: {
    margin: formatSize(10)
  }
}));
