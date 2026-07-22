import { black } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const usePromoRewardsCardStyles = createUseStylesMemoized(({ colors, typography }) => ({
  root: {
    ...generateShadow(1, black),
    marginHorizontal: formatSize(16),
    marginVertical: formatSize(8),
    borderWidth: formatSize(1),
    borderColor: '#FFD600',
    borderRadius: formatSize(10),
    overflow: 'hidden',
    backgroundColor: colors.cardBG
  },
  content: { padding: formatSize(16) },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { ...typography.body15Semibold, color: colors.black, flex: 1, marginLeft: formatSize(8) },
  description: {
    ...typography.caption11Regular,
    color: colors.gray1,
    marginTop: formatSize(12),
    lineHeight: formatSize(13)
  },
  introFooter: { alignItems: 'center', paddingVertical: formatSize(12), backgroundColor: '#FFF2E5' },
  introFooterText: { ...typography.caption13Semibold, color: colors.orange },
  divider: { height: formatSize(1), backgroundColor: colors.lines, marginTop: formatSize(12) },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: formatSize(12) },
  stat: { flex: 1 },
  statEnd: { alignItems: 'flex-end' },
  label: { ...typography.caption11Regular, color: colors.gray1 },
  value: { ...typography.numbersRegular17, color: colors.black, marginTop: formatSize(2) },
  positiveValue: { ...typography.numbersRegular17, color: '#2E9E5B', marginTop: formatSize(2) },
  empty: { ...typography.caption13Regular, color: colors.gray1, marginTop: formatSize(12) },
  loader: { marginVertical: formatSize(8) }
}));
