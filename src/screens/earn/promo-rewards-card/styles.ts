import { black } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const usePromoRewardsCardStyles = createUseStylesMemoized(({ colors, typography }) => ({
  root: {
    ...generateShadow(1, black),
    marginHorizontal: formatSize(16),
    marginVertical: formatSize(8),
    borderRadius: formatSize(8),
    overflow: 'hidden'
  },
  card: {
    backgroundColor: colors.cardBG
  },
  borderGradient: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 1 },
  content: { padding: formatSize(16) },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { ...typography.body15Semibold, color: colors.black, flex: 1, marginLeft: formatSize(8) },
  description: {
    ...typography.caption11Regular,
    color: colors.gray1,
    marginTop: formatSize(12),
    lineHeight: formatSize(13)
  },
  introFooter: { alignItems: 'center', paddingVertical: formatSize(12), backgroundColor: colors.peach10 },
  introFooterText: { ...typography.caption13Semibold, color: colors.orange },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: formatSize(12), height: formatSize(36) },
  stat: { flex: 1 },
  statEnd: { alignItems: 'flex-end' },
  label: { ...typography.caption11Regular, color: colors.gray1 },
  value: { ...typography.numbersRegular17, color: colors.black, marginTop: formatSize(2) },
  positiveValue: { ...typography.numbersRegular17, color: colors.adding, marginTop: formatSize(2) },
  loader: { justifyContent: 'center', alignItems: 'center', marginTop: formatSize(12), height: formatSize(36) }
}));
