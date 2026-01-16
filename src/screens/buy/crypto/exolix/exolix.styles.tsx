import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useExolixStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    padding: formatSize(16),
    backgroundColor: colors.pageBG
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center'
  },
  disclaimerText: {
    ...typography.caption13Regular,
    color: colors.black
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerText: {
    ...typography.caption13Regular,
    textAlign: 'center',
    color: colors.gray1
  },
  description: {
    ...typography.caption13Regular,
    color: colors.white
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: formatSize(48),
    padding: formatSize(8)
  },
  publicKeyHashContainer: {
    paddingHorizontal: formatSize(4),
    paddingVertical: formatSize(2),
    backgroundColor: colors.blue10,
    borderRadius: formatSize(4),
    justifyContent: 'center',
    alignItems: 'center'
  },
  addressContainer: {
    padding: formatSize(12),
    backgroundColor: colors.blue10,
    borderRadius: formatSize(8),
    justifyContent: 'center',
    alignItems: 'center'
  },
  publicKeyHash: {
    ...typography.body17Regular,
    color: colors.blue
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: formatSize(24)
  },
  rowContainer: {
    flexDirection: 'row'
  },
  buttonsContainer: {
    width: formatSize(105)
  },
  rowCenterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  publicKeyHashMedium: {
    ...typography.numbersRegular15,
    color: colors.blue
  },
  infoText: {
    ...typography.caption13Regular,
    color: colors.gray1
  },
  textValue: {
    ...typography.numbersRegular13,
    color: colors.black
  },
  depositText: {
    ...typography.body15Semibold,
    color: colors.black
  },
  actionsContainer: {
    ...typography.caption13Semibold,
    alignItems: 'center',
    color: colors.orange,
    justifyContent: 'center'
  },
  cancelText: {
    ...typography.caption13Semibold,
    alignItems: 'center',
    color: colors.destructive,
    justifyContent: 'center'
  },
  loadingText: {
    ...typography.caption13Regular
  }
}));
