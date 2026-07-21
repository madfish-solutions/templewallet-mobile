import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const usePromoRewardsEnableModalStyles = createUseStyles(({ colors, typography }) => ({
  content: { padding: formatSize(24) },
  title: { ...typography.headline4Bold22, color: colors.black, textAlign: 'center', marginBottom: formatSize(12) },
  description: { ...typography.caption13Regular, color: colors.gray1, textAlign: 'center', lineHeight: formatSize(18) },
  benefit: { flexDirection: 'row', marginTop: formatSize(20), alignItems: 'flex-start' },
  benefitText: { ...typography.body15Regular, color: colors.black, flex: 1, marginLeft: formatSize(12) },
  agreement: {
    ...typography.caption13Regular,
    color: colors.gray1,
    lineHeight: formatSize(18),
    marginTop: formatSize(24)
  }
}));
