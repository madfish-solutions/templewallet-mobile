import { useCallback } from 'react';
import { Share } from 'react-native';

import { LIMIT_NFT_FEATURES } from 'src/config/system';
import { CollectibleModalSelectors } from 'src/modals/collectible-modal/collectible-modal.selectors';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { formatImgUri } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';
import { buildCollectibleUniversalLink } from 'src/utils/nft-universal-links';

export const useShareNFT = (slug: string, image?: string, title?: string, description?: string) => {
  const { trackEvent } = useAnalytics();

  return useCallback(async () => {
    const linkUrl = buildCollectibleUniversalLink(
      slug,
      isDefined(image) ? formatImgUri(image, 'raw') : image,
      title,
      description
    );

    try {
      await Share.share({
        message: `View ${LIMIT_NFT_FEATURES ? 'collectible' : 'NFT'} with Temple Wallet mobile: ${linkUrl}`
      });

      await trackEvent(CollectibleModalSelectors.shareNFTSuccess, AnalyticsEventCategory.ButtonPress);
    } catch (error: any) {
      showErrorToast({
        description: error.message,
        isCopyButtonVisible: true,
        onPress: () => copyStringToClipboard(error.message)
      });

      await trackEvent(CollectibleModalSelectors.shareNFTFailed, AnalyticsEventCategory.ButtonPress, {
        errorMessage: error.message
      });
    }
  }, [description, image, slug, title, trackEvent]);
};
