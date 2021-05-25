import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';
import { generateShadow } from '../../../styles/generate-shadow';

export const useSelectedBakerScreenStyles = createUseStyles(({ colors, typography }) => ({
  bakerCard: {
    ...generateShadow(1, colors.black),
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
    marginLeft: formatSize(10),
    justifyContent: 'space-between'
  },
  nameText: {
    ...typography.caption13Semibold,
    color: colors.black,
    marginBottom: formatSize(2)
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
    color: colors.gray1,
    marginRight: formatSize(6)
  },

  descriptionText: {
    ...typography.caption11Regular,
    color: colors.black
  }
}));
