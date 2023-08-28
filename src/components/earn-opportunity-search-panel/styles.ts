import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useEarnOpportunitySearchPanelStyles = createUseStylesMemoized(({ colors, typography }) => ({
  container: {
    paddingVertical: formatSize(8),
    paddingHorizontal: formatSize(20)
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  depositText: {
    ...typography.caption11Regular,
    color: colors.gray1
  }
}));
