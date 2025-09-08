import { black } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';
import { generateShadow } from '../../../styles/generate-shadow';

export const useSelectBakerItemStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    ...generateShadow(1, black),
    padding: formatSize(6),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG,
    borderWidth: formatSize(2),
    borderColor: colors.cardBG
  },
  containerSelected: {
    borderColor: colors.orange
  },
  recommendedContainer: {
    height: formatSize(21),
    justifyContent: 'center',
    alignSelf: 'flex-start',
    position: 'relative',
    top: formatSize(-8),
    left: formatSize(-8),
    backgroundColor: colors.blue,
    borderTopStartRadius: formatSize(10),
    borderBottomEndRadius: formatSize(10)
  },
  recommendedText: {
    ...typography.tagline13Tag,
    textTransform: 'none',
    paddingHorizontal: formatSize(12),
    color: colors.white
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
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameText: {
    ...typography.caption13Semibold,
    color: colors.black,
    marginBottom: formatSize(2),
    width: formatSize(130)
  },
  actionsContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    margin: formatSize(4),
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
    ...typography.numbersRegular13,
    color: colors.black
  },
  accountPkh: {
    height: formatSize(24)
  }
}));
