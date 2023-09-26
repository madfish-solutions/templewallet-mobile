import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useGenerateArtStyles = createUseStyles(() => ({
  root: {
    marginTop: formatSize(24),
    paddingHorizontal: formatSize(16)
  },
  marginTop: {
    marginTop: formatSize(16)
  },
  marginBottom: {
    marginBottom: formatSize(16)
  }
}));
