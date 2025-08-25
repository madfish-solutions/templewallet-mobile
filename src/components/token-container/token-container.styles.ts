import { DEFAULT_BORDER_WIDTH } from '../../config/styles';
import { basicLightColors } from '../../styles/colors';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useTokenContainerStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: formatSize(16),
    paddingVertical: formatSize(12),
    borderBottomWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines
  },
  leftContainer: {
    flexDirection: 'row',
    flexShrink: 1
  },
  infoContainer: {
    justifyContent: 'center',
    flexShrink: 1
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  symbolText: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  apyContainer: {
    backgroundColor: colors.blue,
    borderRadius: formatSize(8),
    paddingHorizontal: formatSize(4),
    paddingVertical: formatSize(2),
    marginLeft: formatSize(4)
  },
  apyText: {
    ...typography.tagline11Tag,
    color: basicLightColors.white
  },
  nameText: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
}));
