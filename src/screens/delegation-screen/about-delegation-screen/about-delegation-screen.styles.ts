import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize, formatTextSize } from '../../../styles/format-size';

export const useAboutDelegationScreenStyles = createUseStyles(({ colors, typography }) => ({
  content: {
    alignItems: 'center'
  },
  title: {
    ...typography.numbersRegular22,
    fontSize: formatTextSize(18),
    fontWeight: '700',
    color: colors.black,
    letterSpacing: formatSize(0.38),
    lineHeight: formatTextSize(25),
    textAlign: 'center'
  },
  titleBlue: {
    color: colors.blue
  },
  descriptionContainer: {
    width: '100%',
    marginHorizontal: formatSize(16),
    paddingHorizontal: formatSize(24),
    paddingVertical: formatSize(32),
    backgroundColor: colors.blue10,
    borderRadius: formatSize(20)
  },
  row: {
    flexDirection: 'row'
  },
  description: {
    ...typography.body15Regular,
    marginLeft: formatSize(20),
    marginRight: formatSize(24),
    letterSpacing: formatSize(-0.24),
    lineHeight: formatTextSize(20),
    fontWeight: '400',
    color: colors.black
  },
  text: {
    ...typography.caption11Regular,
    color: colors.black,
    textAlign: 'center'
  },
  buttonLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
}));
