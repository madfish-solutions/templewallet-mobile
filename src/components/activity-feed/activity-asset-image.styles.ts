import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const ACTIVITY_ASSET_IMAGE_SIZE = formatSize(40);
export const ACTIVITY_ASSET_NFT_BORDER_RADIUS = formatSize(8);
export const ACTIVITY_ASSET_BADGE_LOGO_SIZE = formatSize(12);
export const ACTIVITY_ASSET_STACK_TOKEN_FACE_SIZE = formatSize(30);
export const ACTIVITY_ASSET_STACK_NFT_FACE_SIZE = formatSize(28);
export const ACTIVITY_ASSET_STACK_FACE_NFT_BORDER_RADIUS = formatSize(8);

const BADGE_SIZE = formatSize(16);
const STACK_BACK_SIZE = formatSize(24);
const STACK_MIDDLE_SIZE = formatSize(28);
const STACK_FRONT_SIZE = formatSize(32);

export const useActivityAssetImageStyles = createUseStyles(({ colors }) => ({
  container: {
    width: ACTIVITY_ASSET_IMAGE_SIZE,
    height: ACTIVITY_ASSET_IMAGE_SIZE
  },
  face: {
    overflow: 'hidden'
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray4
  },
  badge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BADGE_SIZE / 2,
    borderWidth: formatSize(0.8),
    borderColor: colors.lines,
    backgroundColor: colors.pageBG
  },
  stackMedallion: {
    position: 'absolute',
    borderWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines,
    backgroundColor: colors.white
  },
  stackBack: {
    top: 0,
    left: 0,
    width: STACK_BACK_SIZE,
    height: STACK_BACK_SIZE,
    borderRadius: STACK_BACK_SIZE / 2
  },
  stackMiddle: {
    top: formatSize(3),
    left: formatSize(3),
    width: STACK_MIDDLE_SIZE,
    height: STACK_MIDDLE_SIZE,
    borderRadius: STACK_MIDDLE_SIZE / 2
  },
  stackFront: {
    right: formatSize(2),
    bottom: formatSize(2),
    width: STACK_FRONT_SIZE,
    height: STACK_FRONT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: STACK_FRONT_SIZE / 2
  },
  stackMedallionNft: {
    borderRadius: ACTIVITY_ASSET_NFT_BORDER_RADIUS
  },
  stackMedallionWithoutAsset: {
    backgroundColor: colors.gray4
  },
  collectibleImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  }
}));
