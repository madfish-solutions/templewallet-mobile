import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useBuyStyles = createUseStyles(() => ({
  optionsContainer: {
    paddingTop: formatSize(8)
  }
}));
