import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useSelectedBakerScreenStyles = createUseStyles(({ colors, typography }) => ({
  card: {
    ...generateShadow(1, black),
    marginTop: formatSize(16),
    marginHorizontal: formatSize(16),
    padding: formatSize(8),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG
  },
  upperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  mainContentContainer: {
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
  },
  stakeIcon: {
    padding: formatSize(4),
    backgroundColor: colors.blue10,
    borderRadius: formatSize(8)
  },
  linkIcon: {
    marginRight: formatSize(8)
  }
}));
