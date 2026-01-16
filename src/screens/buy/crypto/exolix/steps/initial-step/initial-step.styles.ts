import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useInitialStepStyles = createUseStyles(({ colors, typography }) => ({
  exchangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines,
    paddingBottom: formatSize(16),
    backgroundColor: colors.pageBG,
    marginBottom: formatSize(16)
  },
  initialStepContainer: {
    padding: formatSize(16),
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.pageBG,
    justifyContent: 'space-between'
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  termsOfUse: {
    ...typography.caption11Regular,
    textAlign: 'center',
    color: colors.black
  },
  exchangeRate: {
    ...typography.caption13Regular,
    color: colors.gray1
  },
  exchangeRateValue: {
    ...typography.numbersRegular13,
    color: colors.black
  },
  thirdParty: {
    ...typography.caption11Regular,
    textAlign: 'center',
    color: colors.gray1
  }
}));
