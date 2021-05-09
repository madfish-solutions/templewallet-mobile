import { createUseStyles } from '../../../styles/create-use-styles';

export const useTabBarLabelStyles = createUseStyles(({ typography }) => ({
  label: {
    ...typography.caption11Regular,
    // TODO: replace this with correct typography name
    fontSize: 10
  },
}));
