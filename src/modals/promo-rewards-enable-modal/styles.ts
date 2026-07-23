import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const usePromoRewardsEnableModalStyles = createUseStyles(({ colors, typography }) => ({
  content: { flexGrow: 1, paddingTop: formatSize(24) },
  animation: {
    alignSelf: 'center',
    width: formatSize(320),
    height: formatSize(168)
  },
  titleContainer: { paddingVertical: formatSize(12), width: '100%' },
  title: {
    ...typography.body20Bold,
    textTransform: 'none',
    color: colors.black,
    lineHeight: formatSize(25),
    textAlign: 'center'
  },
  benefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: formatSize(16),
    paddingBottom: formatSize(8)
  },
  benefit: {
    backgroundColor: colors.cardBG,
    borderColor: colors.lines,
    borderRadius: formatSize(8),
    borderWidth: formatSize(0.5),
    marginBottom: formatSize(8),
    padding: formatSize(12),
    width: '48.7%'
  },
  benefitText: {
    ...typography.caption11Regular,
    color: colors.black,
    lineHeight: formatSize(16),
    marginTop: formatSize(4)
  },
  agreement: {
    ...typography.caption11Regular,
    color: colors.gray1,
    lineHeight: formatSize(13),
    paddingHorizontal: formatSize(4),
    paddingVertical: formatSize(12),
    textAlign: 'center'
  },
  buttonsContainer: {
    paddingHorizontal: formatSize(16)
  }
}));
