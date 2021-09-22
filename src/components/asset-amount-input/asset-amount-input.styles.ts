import { createUseStyles } from '../../styles/create-use-styles';

export const useAssetAmountInputStyles = createUseStyles(({ colors, typography }) => ({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  equivalentValueText: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  balanceContainer: {
    alignSelf: 'flex-start'
  },
  balanceRow: {
    flexDirection: 'row',
    alignSelf: 'flex-end'
  },
  balanceDescription: {
    ...typography.caption11Regular,
    color: colors.gray1
  },
  balanceValueText: {
    ...typography.numbersRegular11,
    color: colors.black
  }
}));
