import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useRewardsAnnouncementModalStyles = createUseStyles(({ colors, typography }) => ({
  content: { flex: 1, justifyContent: 'center', padding: formatSize(24) },
  icon: { alignSelf: 'center', marginBottom: formatSize(32) },
  title: { ...typography.headline4Bold22, color: colors.black, textAlign: 'center', marginBottom: formatSize(16) },
  description: { ...typography.caption13Regular, color: colors.gray1, lineHeight: formatSize(18), textAlign: 'center' },
  benefits: { flexDirection: 'row', marginTop: formatSize(24) },
  benefit: {
    flex: 1,
    padding: formatSize(12),
    borderWidth: formatSize(0.5),
    borderColor: colors.lines,
    borderRadius: formatSize(8)
  },
  benefitText: {
    ...typography.caption13Regular,
    color: colors.black,
    marginTop: formatSize(8),
    lineHeight: formatSize(18)
  }
}));
