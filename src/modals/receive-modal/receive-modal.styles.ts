import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useReceiveModalStyles = createUseStyles(() => ({
  cardsListContainer: {
    paddingTop: formatSize(16),
    paddingHorizontal: 0
  },
  cardsList: {
    paddingHorizontal: formatSize(16),
    gap: formatSize(24)
  }
}));
