import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useAppMetadataViewStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    borderColor: colors.lines,
    borderBottomWidth: formatSize(0.5)
  },
  appContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  nameText: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  descriptionText: {
    ...typography.caption13Semibold,
    color: colors.gray1
  }
}));
