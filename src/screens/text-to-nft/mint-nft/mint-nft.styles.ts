import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCreateNftStyles = createUseStyles(({ typography }) => ({
  image: {
    borderRadius: formatSize(10)
  },
  fontBody17Regular: {
    ...typography.body17Regular
  },
  descriptionInput: {
    textAlignVertical: 'top',
    minHeight: formatSize(80)
  }
}));
