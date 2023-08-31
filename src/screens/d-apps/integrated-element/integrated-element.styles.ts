import { greyLight400, white } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useIntegratedElementStyles = createUseStyles(({ typography }) => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: formatSize(10),
    paddingHorizontal: formatSize(24),
    paddingVertical: formatSize(20)
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: formatSize(48),
    height: formatSize(48),
    marginRight: formatSize(16),
    borderRadius: formatSize(64),
    backgroundColor: white
  },
  title: {
    ...typography.body15Semibold,
    color: white
  },
  description: {
    ...typography.caption11Regular,
    color: greyLight400
  }
}));
