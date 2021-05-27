import { createUseStyles } from '../../../../../styles/create-use-styles';
import { formatSize } from '../../../../../styles/format-size';
import { generateShadow } from '../../../../../styles/generate-shadow';

export const useSelectBakerItemStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    ...generateShadow(1, colors.black),
    padding: formatSize(8),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG
  },
  upperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bakerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bakerContainerData: {
    marginLeft: formatSize(10),
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameText: {
    ...typography.caption13Semibold,
    color: colors.black,
    marginBottom: formatSize(2)
  },
  actionsContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    margin: formatSize(12)
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
}));
