import { createUseStyles } from '../../../../../styles/create-use-styles';
import { formatSize } from '../../../../../styles/format-size';

export const useCreateNftStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    paddingHorizontal: formatSize(16)
  },
  title: {
    marginBottom: formatSize(12),
    ...typography.body15Semibold,
    color: colors.black
  },
  positivePrompt: {
    marginBottom: formatSize(24)
  },
  checkboxLabel: {
    ...typography.caption13Regular,
    color: colors.gray1
  },
  nagativePrompt: {
    marginTop: formatSize(16)
  },
  section: {
    marginTop: formatSize(24)
  },
  artStyles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%'
  },
  artStyle: {
    marginBottom: formatSize(8)
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: formatSize(12)
  },
  detailsText: {
    ...typography.caption13Regular,
    color: colors.gray1
  },
  detailsCount: {
    ...typography.numbersRegular13,
    color: colors.black
  },
  boldText: {
    ...typography.caption13Semibold
  },
  align: {
    flexDirection: 'row',
    alignItems: 'center'
  }
}));
