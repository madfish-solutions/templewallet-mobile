import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';

export const useAppMetadataViewStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    borderColor: colors.lines,
    borderBottomWidth: DEFAULT_BORDER_WIDTH
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
