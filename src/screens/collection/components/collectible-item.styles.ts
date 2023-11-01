import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

import { ITEM_WIDTH, GAP_SIZE, BORDER_RADIUS, IMAGE_SIZE } from '../utils';

export const useCollectibleItemStyles = createUseStylesMemoized(({ colors, typography }) => ({
  collectibleContainer: {
    flex: 1,
    borderWidth: formatSize(1),
    borderRadius: formatSize(BORDER_RADIUS),
    borderColor: colors.lines,
    backgroundColor: colors.navigation,
    width: formatSize(ITEM_WIDTH),
    marginLeft: formatSize(GAP_SIZE),
    position: 'relative'
  },
  imageWrap: {
    backgroundColor: colors.blue10,
    width: formatSize(IMAGE_SIZE),
    height: formatSize(IMAGE_SIZE)
  },
  listed: {
    position: 'absolute',
    borderTopLeftRadius: formatSize(BORDER_RADIUS),
    borderBottomRightRadius: formatSize(BORDER_RADIUS),
    backgroundColor: colors.blue,
    zIndex: 10,
    paddingVertical: formatSize(3),
    paddingHorizontal: formatSize(12)
  },
  listedText: {
    color: colors.white,
    ...typography.tagline13Tag
  },
  collectible: {
    margin: formatSize(16),
    justifyContent: 'space-between',
    flex: 1
  },
  collectibleName: {
    color: colors.black,
    maxWidth: formatSize(200),
    ...typography.body20Bold
  },
  collectibleDescription: {
    color: colors.black,
    marginTop: formatSize(8),
    maxWidth: formatSize(285),
    ...typography.caption13Regular,
    height: formatSize(54)
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: formatSize(16)
  },
  containerLeft: {
    width: '50%',
    paddingLeft: formatSize(4)
  },
  containerRight: {
    width: '50%',
    paddingRight: formatSize(4)
  },
  smallContainer: {
    borderWidth: formatSize(1),
    borderColor: colors.lines,
    borderRadius: formatSize(10),
    paddingVertical: formatSize(8),
    alignItems: 'flex-start',
    paddingLeft: formatSize(12)
  },
  text: {
    color: colors.gray1,
    ...typography.caption13Regular
  },
  value: {
    color: colors.black,
    marginTop: formatSize(8),
    ...typography.numbersMedium17
  },

  buttonContainer: {
    marginTop: formatSize(8),
    justifyContent: 'flex-end'
  },
  actionButton: {
    marginTop: formatSize(8),
    borderWidth: formatSize(2),
    borderRadius: formatSize(10),
    alignItems: 'center'
  },
  actionButtonText: {
    paddingVertical: formatSize(13),
    ...typography.body17Semibold
  },

  firstButtonActive: {
    borderColor: colors.peach,
    color: colors.peach
  },
  firstButtonDisabled: {
    borderColor: colors.disabled,
    color: colors.disabled
  },

  secondButtonActive: {
    borderColor: colors.peach,
    color: colors.white,
    backgroundColor: colors.peach
  },
  secondButtonDisabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled
  },
  secondButtonTextDisabled: {
    color: colors.white
  },

  topContainer: {
    flex: 1
  },
  secondButtonTextActive: {
    color: colors.white
  },
  nameBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: formatSize(12)
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  shareButtonText: {
    ...typography.tagline13Tag,
    color: colors.peach
  }
}));
