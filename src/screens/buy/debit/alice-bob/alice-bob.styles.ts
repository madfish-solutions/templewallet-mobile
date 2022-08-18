import { createUseStyles } from '../../../../styles/create-use-styles';

export const useAliceBobStyles = createUseStyles(({ colors, typography }) => ({
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
  }
}));
