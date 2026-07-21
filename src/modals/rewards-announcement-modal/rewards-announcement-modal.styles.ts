import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useRewardsAnnouncementModalStyles = createUseStyles(({ colors, typography }) => ({
  content: {
    flex: 1,
    paddingVertical: formatSize(24),
    paddingHorizontal: formatSize(24)
  },
  animation: {
    alignSelf: 'center',
    width: formatSize(320),
    height: formatSize(168),
    marginBottom: formatSize(32)
  },
  info: {
    alignItems: 'center',
    marginBottom: formatSize(16)
  },
  title: {
    ...typography.body20Bold,
    textTransform: 'none',
    color: colors.black,
    textAlign: 'center',
    marginBottom: formatSize(8)
  },
  description: {
    ...typography.caption13Regular,
    color: colors.gray1,
    lineHeight: formatSize(18),
    textAlign: 'center'
  },
  emphasizedDescription: {
    ...typography.caption13Semibold
  },
  benefits: {
    flexDirection: 'row',
    marginBottom: formatSize(8)
  },
  benefit: {
    flex: 1,
    padding: formatSize(12),
    borderWidth: formatSize(0.5),
    borderColor: colors.lines,
    borderRadius: formatSize(8),
    backgroundColor: colors.cardBG
  },
  benefitText: {
    ...typography.caption11Regular,
    color: colors.black,
    marginTop: formatSize(4),
    lineHeight: formatSize(16)
  },
  managePromo: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: formatSize(8),
    padding: formatSize(10)
  },
  managePromoText: {
    ...typography.caption13Semibold,
    color: colors.orange,
    marginLeft: formatSize(4)
  }
}));
