import { BigNumber } from 'bignumber.js';
import React, { memo, useCallback, useMemo } from 'react';
import { TouchableOpacity, View, Text, Share } from 'react-native';
import useSWR from 'swr';

import { fetchCollectibleExtraDetails, objktCurrencies } from 'src/apis/objkt';
import { StaticCollectibleImage } from 'src/components/collectible-icon/collectible-icon';
import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { BLOCK_DURATION } from 'src/config/fixed-times';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { SHARE_NFT_CONTENT } from 'src/modals/collectible-modal/collectible-modal';
import { CollectibleModalSelectors } from 'src/modals/collectible-modal/collectible-modal.selectors';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
// import { useAssetBalanceSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { CollectionItemInterface } from 'src/token/interfaces/collectible-interfaces.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { getTempleDynamicLink } from 'src/utils/get-temple-dynamic-link.util';
import { formatImgUri, ImageResolutionEnum } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';
import { formatAssetAmount } from 'src/utils/number.util';
import { SUPPORTED_CONTRACTS, buildBuyCollectibleParams, buildSellCollectibleParams } from 'src/utils/objkt';
import { createTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { mutezToTz } from 'src/utils/tezos.util';

import { navigateToObjktForBuy } from '../utils';
import { useCollectibleItemStyles } from './collectible-item.styles';

const DETAILS_SYNC_INTERVAL = 4 * BLOCK_DURATION;

interface Props {
  item: CollectionItemInterface;
  collectionContract: string;
  selectedRpc: string;
  accountPkh: string;
}

export const CollectibleItem = memo<Props>(({ item, collectionContract, selectedRpc, accountPkh }) => {
  const slug = getTokenSlug(item);

  const styles = useCollectibleItemStyles();
  const { navigate } = useNavigation();

  const { trackEvent } = useAnalytics();

  // const balance = useAssetBalanceSelector(slug);

  const lastPrice = useMemo(() => {
    if (item.lastDeal?.price == null) {
      return '---';
    }

    const currency = objktCurrencies[item.lastDeal.currency_id];
    if (!currency) {
      return '---';
    }

    const price = formatAssetAmount(mutezToTz(BigNumber(item.lastDeal.price), currency.decimals));

    return `${price} ${currency.symbol}`;
  }, [item]);

  const { data: extraDetails } = useSWR(
    ['fetchCollectibleExtraDetails', item.address, item.id],
    () => fetchCollectibleExtraDetails(item.address, item.id),
    {
      errorRetryCount: 2,
      refreshInterval: DETAILS_SYNC_INTERVAL
    }
  );

  const isAccountHolder = useMemo(
    () => item.holders.some(h => h.holder_address === accountPkh && h.quantity > 0),
    [item.holders, accountPkh]
  );

  const firstButton = useMemo(() => {
    if (!isAccountHolder) {
      return {
        title: 'Make offer',
        // disabled: !isDefined(item.lowestAsk),
        onPress: () => navigateToObjktForBuy(collectionContract, item.id)
      };
    }

    const takableOffers = extraDetails?.offers_active.filter(o => o.buyer_address !== accountPkh);
    const highestOffer = takableOffers?.length ? takableOffers[takableOffers.length - 1] : null;

    if (!highestOffer) {
      return {
        title: 'No offers yet',
        disabled: true
      };
    }

    const currency = objktCurrencies[highestOffer.currency_id];

    if (!currency) {
      return {
        title: 'Sell',
        disabled: true
      };
    }

    const priceToDisplay = mutezToTz(BigNumber(highestOffer.price), currency.decimals);

    return {
      title: `Sell for ${priceToDisplay} ${currency.symbol}`,
      onPress: () =>
        void buildSellCollectibleParams(
          createTezosToolkit(selectedRpc),
          accountPkh,
          collectionContract,
          item.id,
          highestOffer,
          currency
        ).then(opParams =>
          navigate(ModalsEnum.Confirmation, {
            type: ConfirmationTypeEnum.InternalOperations,
            opParams
          })
        )
    };
  }, [accountPkh, selectedRpc, isAccountHolder, collectionContract, item.id, extraDetails?.offers_active, navigate]);

  const secondButton = useMemo(() => {
    if (isAccountHolder) {
      const holdingAmount = item.holders.reduce(
        (acc, curr) => (curr.holder_address === accountPkh ? acc + curr.quantity : acc),
        0
      );
      const listedAmount = item.listingsActive.reduce(
        (acc, curr) => (curr.seller_address === accountPkh ? acc + curr.amount : acc),
        0
      );

      if (listedAmount < holdingAmount) {
        return {
          title: 'List',
          onPress: () => navigateToObjktForBuy(collectionContract, item.id)
        };
      }

      return {
        title: 'Listed',
        disabled: true
      };
    }

    const listing = item.listingsActive[0];

    if (!listing) {
      return {
        title: 'Not listed',
        disabled: true
      };
    }

    const isSupportedContract = SUPPORTED_CONTRACTS.includes(listing.marketplace_contract);
    const purchaseCurrency = objktCurrencies[listing.currency_id];

    if (!isSupportedContract || !purchaseCurrency) {
      return {
        title: 'Buy',
        disabled: true
      };
    }

    const priceToDisplay = mutezToTz(new BigNumber(listing.price), purchaseCurrency.decimals);

    return {
      title: `Buy for ${priceToDisplay} ${purchaseCurrency.symbol}`,
      onPress: () =>
        void buildBuyCollectibleParams(createTezosToolkit(selectedRpc), accountPkh, listing, purchaseCurrency).then(
          opParams =>
            navigate(ModalsEnum.Confirmation, {
              type: ConfirmationTypeEnum.InternalOperations,
              opParams
            })
        )
    };
  }, [
    accountPkh,
    selectedRpc,
    isAccountHolder,
    collectionContract,
    item.id,
    item.holders,
    item.listingsActive,
    navigate
  ]);

  const handleShare = useCallback(async () => {
    // Max link length: 7168 symbols, so we need to reduce the amount of data we send
    const urlEncodedData = encodeURIComponent(JSON.stringify(`${item.address}_${item.id}`));

    if (urlEncodedData.length > 7168) {
      return void showErrorToast({ title: 'Cannot share', description: 'Data is too large' });
    }

    try {
      const dynamicLink = await getTempleDynamicLink(`/nft?jsonData=${urlEncodedData}`, {
        title: item.name,
        descriptionText: item.description,
        imageUrl: isDefined(item.thumbnailUri) ? formatImgUri(item.thumbnailUri, ImageResolutionEnum.MEDIUM) : undefined
      });

      await Share.share({
        message: SHARE_NFT_CONTENT + dynamicLink
      });

      await trackEvent(CollectibleModalSelectors.shareNFTSuccess, AnalyticsEventCategory.ButtonPress);
    } catch (e: any) {
      showErrorToast({
        description: e.message,
        isCopyButtonVisible: true,
        onPress: () => copyStringToClipboard(e.message)
      });
      await trackEvent(CollectibleModalSelectors.shareNFTFailed, AnalyticsEventCategory.ButtonPress, {
        errorMessage: e.message
      });
    }
  }, [item, trackEvent]);

  const navigateToCollectibleModal = () => navigate(ModalsEnum.CollectibleModal, { slug });

  const imageSize = formatSize(295);

  return (
    <View style={styles.collectibleContainer}>
      {isDefined(item.lowestAsk) && (
        <View style={styles.listed}>
          <Text style={styles.listedText}>LISTED</Text>
        </View>
      )}

      <View style={styles.collectible}>
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={navigateToCollectibleModal} activeOpacity={1}>
            <View style={[styles.imageWrap, { width: imageSize, height: imageSize }]}>
              <StaticCollectibleImage isBigIcon={true} slug={slug} artifactUri={item.artifactUri} size={imageSize} />
            </View>
          </TouchableOpacity>

          <View style={styles.nameBlock}>
            <Text style={styles.collectibleName} numberOfLines={1}>
              {item.name}
            </Text>

            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Icon name={IconNameEnum.Share} />
              <Divider size={formatSize(4)} />
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.collectibleDescription} numberOfLines={3}>
            {item.description}
          </Text>

          <View style={styles.infoContainer}>
            <View style={styles.containerRight}>
              <View style={styles.smallContainer}>
                <Text style={styles.text}>Last Price</Text>
                <Text style={styles.value}>{lastPrice}</Text>
              </View>
            </View>
            <View style={styles.containerLeft}>
              <View style={styles.smallContainer}>
                <Text style={styles.text}>Editions</Text>
                <Text style={styles.value}>{item.editions}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={firstButton.onPress}
            disabled={firstButton.disabled}
            style={[styles.actionButton, firstButton.disabled ? styles.firstButtonDisabled : styles.firstButtonActive]}
          >
            <Text
              style={[
                styles.actionButtonText,
                firstButton.disabled ? styles.firstButtonDisabled : styles.firstButtonActive
              ]}
            >
              {firstButton.title}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={secondButton.onPress}
            style={[
              styles.actionButton,
              secondButton.disabled ? styles.secondButtonDisabled : styles.secondButtonActive
            ]}
            disabled={secondButton.disabled}
          >
            <Text
              style={[
                styles.actionButtonText,
                secondButton.disabled ? styles.secondButtonTextDisabled : styles.secondButtonTextActive
              ]}
            >
              {secondButton.title}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});
