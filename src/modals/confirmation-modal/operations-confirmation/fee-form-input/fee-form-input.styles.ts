import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useFeeFormInputStyles = createUseStyles(({ colors, typography }) => ({
  infoContainer: {
    flexDirection: 'row'
  },
  infoContainerItem: {
    width: '31%'
  },
  infoTitle: {
    ...typography.caption11Regular,
    color: colors.gray1
  },
  infoFeeAmount: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  infoFeeValue: {
    ...typography.numbersRegular11,
    color: colors.gray1
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
