import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useQuestionAccordionStyles = createUseStylesMemoized(({ colors, typography }) => ({
  container: {
    borderRadius: formatSize(8),
    backgroundColor: colors.peach10
  },
  switcher: {
    padding: formatSize(8),
    flexDirection: 'row',
    alignItems: 'center'
  },
  helpIcon: {
    alignSelf: 'flex-end'
  },
  question: {
    ...typography.caption13Semibold,
    letterSpacing: formatSize(-0.08),
    color: colors.black,
    flex: 1
  },
  answer: {
    paddingLeft: formatSize(8),
    paddingRight: formatSize(24),
    paddingBottom: formatSize(8)
  }
}));
