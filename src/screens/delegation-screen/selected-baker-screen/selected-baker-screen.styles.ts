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
    color: colors.black
  },
  actionsContainer: {
    flexDirection: 'row'
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

  rewardsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: formatSize(12),
    paddingHorizontal: formatSize(20),
    borderBottomWidth: formatSize(0.5),
    borderColor: colors.lines
  },
  rewardsText: {
    ...typography.body15Semibold,
    color: colors.black
  },

  descriptionText: {
    ...typography.caption11Regular,
    color: colors.black
  }
}));
