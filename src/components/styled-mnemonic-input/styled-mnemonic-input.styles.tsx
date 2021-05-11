import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useStyledMnemonicInputStyles = createUseStyles(({ colors, typography }) => ({
  view: {
    position: 'relative'
  },
  eyeButton: {
    position: 'absolute',
    top: formatSize(13),
    right: formatSize(48)
  },
  buttonsContainer: {
    zIndex: 1,
    position: 'absolute',
    justifyContent: 'space-between',
    flexDirection: 'row',
    bottom: formatSize(8),
    right: formatSize(8)
  },
  buttonMargin: {
    marginRight: formatSize(8)
  },
  protectedImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  protectedView: {
    zIndex: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    ...typography.body20Bold,
    color: colors.black,
    marginTop: formatSize(5)
  },
  secondTitle: {
    ...typography.body17Semibold,
    color: colors.black
  }
}));
