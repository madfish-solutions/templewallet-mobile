import { OpKind } from '@taquito/rpc';
import { BigNumber } from 'bignumber.js';
import { debounce } from 'lodash-es';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { ListRenderItem, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { BakerInterface, buildUnknownBaker } from 'src/apis/baking-bad';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { SearchInput } from 'src/components/search-input/search-input';
import { Sorter } from 'src/components/sorter/sorter';
import { BakersSortFieldEnum } from 'src/enums/bakers-sort-field.enum';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { useCanUseOnRamp } from 'src/hooks/use-can-use-on-ramp.hook';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useOnRampContinueOverlay } from 'src/hooks/use-on-ramp-continue-overlay.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal, useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { OnRampOverlay } from 'src/screens/wallet/on-ramp-overlay/on-ramp-overlay';
import { useBakersListSelector, useSelectedBakerSelector } from 'src/store/baking/baking-selectors';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';
import { useCurrentAccountPkhSelector, useCurrentAccountTezosBalance } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { EVERSTAKE_BAKER_ADDRESS, HELP_UKRAINE_BAKER_ADDRESS, TEMPLE_BAKER_ADDRESS } from 'src/utils/known-bakers';
import { isValidAddress } from 'src/utils/tezos.util';

import { BakerListItem } from './baker-list-item/baker-list-item';
import { DISCLAIMER_MESSAGE, TEZ_LABEL, DCP_LABEL, TEZ_DESCRIPTION, DCP_DESCRIPTION } from './constants';
import { SelectBakerModalSelectors } from './select-baker-modal.selectors';
import { useSelectBakerModalStyles } from './select-baker-modal.styles';

const bakersSortFieldsLabels: Record<BakersSortFieldEnum, string> = {
  [BakersSortFieldEnum.Delegated]: 'Delegated',
  [BakersSortFieldEnum.Space]: 'Space',
  [BakersSortFieldEnum.Fee]: 'Baker Fee',
  [BakersSortFieldEnum.MinBalance]: 'Min Balance'
};
const bakersSortFieldsOptions = [
  BakersSortFieldEnum.Delegated,
  BakersSortFieldEnum.Space,
  BakersSortFieldEnum.Fee,
  BakersSortFieldEnum.MinBalance
];

const keyExtractor = (item: BakerInterface) => item.address;

const sponsoredBakersAddresses = [TEMPLE_BAKER_ADDRESS, EVERSTAKE_BAKER_ADDRESS, HELP_UKRAINE_BAKER_ADDRESS];

export const SelectBakerModal = memo(() => {
  const { goBack } = useNavigation();
  const navigateToModal = useNavigateToModal();
  const styles = useSelectBakerModalStyles();
  const currentBaker = useSelectedBakerSelector();
  const { isTezosNode, isDcpNode } = useNetworkInfo();
  const canUseOnRamp = useCanUseOnRamp();
  const tezosBalance = useCurrentAccountTezosBalance();
  const dispatch = useDispatch();
  const { isOpened: onRampOverlayIsOpened, onClose: onOnRampOverlayClose } = useOnRampContinueOverlay();
  const bakerNameByNode = isDcpNode ? 'Producer' : 'Baker';

  const searchPlaceholder = `Search ${bakerNameByNode}`;
  const unknownBakerName = `Unknown ${bakerNameByNode}`;

  const { trackEvent } = useAnalytics();

  const accountPkh = useCurrentAccountPkhSelector();

  const knownBakers = useBakersListSelector();

  const [sortValue, setSortValue] = useState(BakersSortFieldEnum.Delegated);
  const [searchValue, setSearchValue] = useState<string>();
  const [selectedBaker, setSelectedBaker] = useState<BakerInterface>();

  const debouncedSetSearchValue = debounce((value: string) => {
    setSearchValue(value);
    setSelectedBaker(undefined);
  });

  usePageAnalytic(ModalsEnum.SelectBaker);

  const handleNextPress = () => {
    if (isDefined(selectedBaker)) {
      const isTempleBakerSelected = selectedBaker.address === TEMPLE_BAKER_ADDRESS;
      const isEverstakeBakerSelected = selectedBaker.address === EVERSTAKE_BAKER_ADDRESS;
      const isHelpUkraineBakerSelected = selectedBaker.address === HELP_UKRAINE_BAKER_ADDRESS;

      trackEvent(
        `${isTempleBakerSelected ? 'TEMPLE' : isEverstakeBakerSelected ? 'EVERSTAKE' : 'HELP_UKRAINE'}_BAKER_SELECTED`,
        AnalyticsEventCategory.ButtonPress
      );

      if (currentBaker?.address === selectedBaker.address) {
        showErrorToast({
          title: 'Re-delegation is not possible',
          description: `Already delegated funds to this ${isDcpNode ? 'producer' : 'baker'}.`
        });
      } else if (new BigNumber(tezosBalance).isZero() && canUseOnRamp) {
        dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Continue));
      } else {
        navigateToModal(ModalsEnum.Confirmation, {
          type: ConfirmationTypeEnum.InternalOperations,
          opParams: [{ kind: OpKind.DELEGATION, delegate: selectedBaker.address, source: accountPkh }],
          ...(isTempleBakerSelected && { testID: 'TEMPLE_BAKER_DELEGATION' }),
          ...(isEverstakeBakerSelected && { testID: 'EVERSTAKE_BAKER_DELEGATION' }),
          ...(isHelpUkraineBakerSelected && { testID: 'HELP_UKRAINE_BAKER_DELEGATION' }),
          ...(Boolean(selectedBaker.isUnknownBaker) && !isDcpNode && { disclaimerMessage: DISCLAIMER_MESSAGE })
        });
      }
    }
  };

  const handleSortValueChange = (value: BakersSortFieldEnum) => setSortValue(value);

  const sortedKnownBakers = useMemo(
    () =>
      [...searchBakers(knownBakers, searchValue)]
        .sort(({ delegation: a, address: aAddress }, { delegation: b, address: bAddress }) => {
          const aSponsoredIndex = sponsoredBakersAddresses.indexOf(aAddress);
          const bSponsoredIndex = sponsoredBakersAddresses.indexOf(bAddress);

          const aIsSponsored = aSponsoredIndex !== -1;
          const bIsSponsored = bSponsoredIndex !== -1;

          if (aIsSponsored && bIsSponsored) {
            return aSponsoredIndex - bSponsoredIndex;
          }

          if (aIsSponsored) {
            return -1;
          }
          if (bIsSponsored) {
            return 1;
          }

          switch (sortValue) {
            case BakersSortFieldEnum.Delegated:
              return b.capacity - b.freeSpace - (a.capacity - a.freeSpace);
            case BakersSortFieldEnum.Space:
              return b.freeSpace - a.freeSpace;
            case BakersSortFieldEnum.Fee:
              return a.fee - b.fee;
            default:
              return a.minBalance - b.minBalance;
          }
        })
        .filter(({ address }) => address !== currentBaker?.address),
    [knownBakers, searchValue, sortValue, currentBaker?.address]
  );

  const isValidBakerAddress = isDefined(selectedBaker) && !isValidAddress(selectedBaker.address);

  const unknownBaker = useMemo(
    () => buildUnknownBaker(searchValue ?? '', unknownBakerName),
    [unknownBakerName, searchValue]
  );

  const ListEmptyComponent = useMemo(
    () =>
      searchValue?.toLowerCase() !== accountPkh.toLowerCase() ? (
        <BakerListItem
          item={unknownBaker}
          onPress={setSelectedBaker}
          selected={searchValue === selectedBaker?.address}
        />
      ) : undefined,
    [unknownBakerName, searchValue, accountPkh, selectedBaker?.address]
  );

  const renderItem: ListRenderItem<BakerInterface> = useCallback(
    ({ item }) => (
      <BakerListItem
        item={item}
        selected={item.address === selectedBaker?.address}
        onPress={setSelectedBaker}
        testID={SelectBakerModalSelectors.bakerItem}
      />
    ),
    [selectedBaker?.address]
  );

  return (
    <>
      <ModalStatusBar />
      <View style={styles.background}>
        <Divider size={formatSize(16)} />
        <View style={styles.upperContainer}>
          <Label
            label={isDcpNode ? DCP_LABEL : TEZ_LABEL}
            description={isDcpNode ? DCP_DESCRIPTION : TEZ_DESCRIPTION}
          />
        </View>
        <View style={styles.searchContainer}>
          <SearchInput
            placeholder={searchPlaceholder}
            onChangeText={debouncedSetSearchValue}
            testID={SelectBakerModalSelectors.searchBakerInput}
          />
          {isValidBakerAddress && <Text style={styles.errorText}>Not a valid address</Text>}
          {searchValue === accountPkh && <Text style={styles.errorText}>You can not delegate to yourself</Text>}
        </View>
        {isTezosNode && (
          <View style={styles.upperContainer}>
            <Text style={styles.infoText}>The higher the better</Text>

            <Sorter
              sortValue={sortValue}
              description="Sort bakers by:"
              sortFieldsOptions={bakersSortFieldsOptions}
              sortFieldsLabels={bakersSortFieldsLabels}
              onSetSortValue={handleSortValueChange}
              testID={SelectBakerModalSelectors.sortByDropDownButton}
            />
          </View>
        )}
      </View>

      {isTezosNode && (
        <FlatList
          data={sortedKnownBakers}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.flatList}
          windowSize={10}
          ListEmptyComponent={ListEmptyComponent}
        />
      )}

      {isDcpNode && isValidAddress(searchValue ?? '') && searchValue?.toLowerCase() !== accountPkh.toLowerCase() && (
        <View style={styles.dcpBaker}>
          <Divider size={formatSize(16)} />
          <BakerListItem
            item={unknownBaker}
            onPress={setSelectedBaker}
            selected={searchValue === selectedBaker?.address}
          />
        </View>
      )}

      <ModalButtonsFloatingContainer variant="bordered" style={isDcpNode && styles.buttons}>
        <ButtonLargeSecondary title="Close" onPress={goBack} testID={SelectBakerModalSelectors.closeButton} />
        <ButtonLargePrimary
          title="Next"
          disabled={!isDefined(selectedBaker) || !isValidAddress(selectedBaker.address)}
          onPress={handleNextPress}
          testID={SelectBakerModalSelectors.nextButton}
        />
      </ModalButtonsFloatingContainer>

      <OnRampOverlay isStart={false} onClose={onOnRampOverlayClose} isOpen={onRampOverlayIsOpened} />
    </>
  );
});

const searchBakers = (knownBakers: BakerInterface[], searchValue?: string) => {
  if (!isString(searchValue)) {
    return knownBakers;
  }

  const preparedSearchValue = searchValue.trim().toLowerCase();
  const result: BakerInterface[] = [];

  for (const baker of knownBakers) {
    const { name, address } = baker;

    if (name.toLowerCase().includes(preparedSearchValue) || address.toLowerCase().includes(preparedSearchValue)) {
      result.push(baker);
    }
  }

  return result;
};
