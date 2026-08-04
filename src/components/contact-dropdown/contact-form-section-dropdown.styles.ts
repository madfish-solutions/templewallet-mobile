import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useContactFormSectionDropdownStyles = createUseStyles(() => ({
  listAccountContainer: {
    borderRadius: formatSize(10)
  }
}));
