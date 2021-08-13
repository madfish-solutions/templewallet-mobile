import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useAssetValueStyles = createUseStyles(({ typography, colors }) => ({
  container: {
    width: formatSize(160),
    height: formatSize(56),
    padding: formatSize(8),
    paddingLeft: formatSize(12),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative'
  },
  assetSymbol: {
    ...typography.numbersRegular15,
    color: colors.black,
    flexGrow: 1
  },
  name: {
    ...typography.numbersRegular11,
    color: colors.gray1,
    overflow: 'hidden'
  },
  dropdownTriangleWrapper: {
    height: '100%'
  },
  texts: {
    flexShrink: 1
  },
  filler: {
    flexDirection: 'row',
    flexShrink: 1
  }
}));
