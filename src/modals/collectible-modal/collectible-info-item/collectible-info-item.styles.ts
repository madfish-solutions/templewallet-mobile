import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useCollectibleInfoItemStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: formatSize(44),
    borderBottomColor: colors.lines,
    borderBottomWidth: formatSize(0.5)
  },
  nameText: {
    ...typography.caption13Regular,
    color: colors.gray1
  },
  valueText: {
    ...typography.body15Semibold,
    color: colors.black
  }
}));
