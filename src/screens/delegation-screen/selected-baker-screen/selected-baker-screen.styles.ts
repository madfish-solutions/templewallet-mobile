import { black } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';
import { generateShadow } from '../../../styles/generate-shadow';

export const useSelectedBakerScreenStyles = createUseStyles(({ colors, typography }) => ({
  bakerCard: {
    ...generateShadow(1, black),
    margin: formatSize(16),
    padding: formatSize(8),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG
  },
  upperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bakerContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bakerContainerData: {
    justifyContent: 'space-between'
  },
  nameText: {
    ...typography.caption13Semibold,
    color: colors.black,
    maxWidth: formatSize(140)
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  lowerContainer: {
    flexDirection: 'row'
  },
  cellTitle: {
    ...typography.caption11Regular,
    color: colors.gray1
  },
  cellValueText: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  accountPkh: {
    height: formatSize(24)
  }
}));
