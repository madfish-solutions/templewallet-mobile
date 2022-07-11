import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useExolixStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    padding: formatSize(16),
    backgroundColor: colors.pageBG
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: formatSize(0.5),
    borderTopColor: colors.lines
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
  thirdParty: {
    ...typography.caption11Regular,
    textAlign: 'center',
    color: colors.gray1
  },
  description: {
    ...typography.caption13Regular,
    color: colors.black
  }
}));
