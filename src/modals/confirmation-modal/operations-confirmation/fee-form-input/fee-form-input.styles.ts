import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useFeeFormInputStyles = createUseStyles(({ colors, typography }) => ({
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoContainerItem: {
    width: '30%'
  },
  infoTitle: {
    ...typography.caption11Regular,
    color: colors.gray1
  },
  infoFeeAmount: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  inputContainer: {
    flexDirection: 'row'
  },
  sliderContainer: {
    flexGrow: 1
  },
  toggleViewButton: {
    width: formatSize(28),
    height: formatSize(28),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.orange10,
    borderRadius: formatSize(10)
  }
}));
