import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useImportAccountStyles = createUseStyles(() => ({
  checkbox: {
    flexDirection: 'row',
    alignContent: 'center',
    paddingLeft: formatSize(5),
    marginBottom: formatSize(6)
  }
}));
