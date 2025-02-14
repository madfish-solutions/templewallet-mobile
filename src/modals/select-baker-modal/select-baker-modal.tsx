import { OpKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { debounce } from 'lodash-es';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ListRenderItem, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { BakerInterface, buildUnknownBaker } from 'src/apis/baking-bad';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ModalButtonsContainer } from 'src/components/modal-buttons-container/modal-buttons-container';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { SearchInput } from 'src/components/search-input/search-input';
import { Sorter } from 'src/components/sorter/sorter';
import { BakersSortFieldEnum } from 'src/enums/bakers-sort-field.enum';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { useCanUseOnRamp } from 'src/hooks/use-can-use-on-ramp.hook';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useOnRampContinueOverlay } from 'src/hooks/use-on-ramp-continue-overlay.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
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
import { RECOMMENDED_BAKER_ADDRESS, HELP_UKRAINE_BAKER_ADDRESS } from 'src/utils/known-bakers';
import { isValidAddress } from 'src/utils/tezos.util';

import { BakerListItem } from './baker-list-item/baker-list-item';
import { DISCLAIMER_MESSAGE, TEZ_LABEL, DCP_LABEL, TEZ_DESCRIPTION, DCP_DESCRIPTION } from './constants';
import { SelectBakerModalSelectors } from './select-baker-modal.selectors';
import { useSelectBakerModalStyles } from './select-baker-modal.styles';

const bakersSortFieldsLabels: Record<BakersSortFieldEnum, string> = {
  [BakersSortFieldEnum.Fee]: 'Fee',
  [BakersSortFieldEnum.Rank]: 'Rank',
  [BakersSortFieldEnum.Space]: 'Space',
  [BakersSortFieldEnum.Staking]: 'Staking'
};
const bakersSortFieldsOptions = [
  BakersSortFieldEnum.Space,
  BakersSortFieldEnum.Fee,
  BakersSortFieldEnum.Rank,
  BakersSortFieldEnum.Staking
];

const keyExtractor = (item: BakerInterface) => item.address;

export const SelectBakerModal = memo(() => {
  const { goBack, navigate } = useNavigation();
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

  const bakersList = useBakersListSelector();
  const activeBakers = useMemo(() => bakersList.filter(baker => baker.status === 'active'), [bakersList]);

  const [allBakers, setFilteredBakersList] = useState(activeBakers);
  const [sortValue, setSortValue] = useState(BakersSortFieldEnum.Rank);
  const [searchValue, setSearchValue] = useState<string>();
  const [selectedBaker, setSelectedBaker] = useState<BakerInterface>();

  const recommendedBakers = useMemo(
    () =>
      allBakers.filter(
        baker => baker.address === RECOMMENDED_BAKER_ADDRESS || baker.address === HELP_UKRAINE_BAKER_ADDRESS
      ),
    [allBakers]
  );

  const filteredBakersList = useMemo(
    () =>
      allBakers.filter(
        baker => baker.address !== RECOMMENDED_BAKER_ADDRESS && baker.address !== HELP_UKRAINE_BAKER_ADDRESS
      ),
    [allBakers]
  );

  const debouncedSetSearchValue = debounce((value: string) => {
    setSearchValue(value);
    setSelectedBaker(undefined);
  });

  usePageAnalytic(ModalsEnum.SelectBaker);

  const handleNextPress = () => {
    if (isDefined(selectedBaker)) {
      const isRecommendedBakerSelected = selectedBaker.address === RECOMMENDED_BAKER_ADDRESS;
      const isHelpUkraineBakerSelected = selectedBaker.address === RECOMMENDED_BAKER_ADDRESS;

      if (isRecommendedBakerSelected) {
        trackEvent('RECOMMENDED_BAKER_SELECTED', AnalyticsEventCategory.ButtonPress);
      }

      if (isHelpUkraineBakerSelected) {
        trackEvent('HELP_UKRAINE_BAKER_SELECTED', AnalyticsEventCategory.ButtonPress);
      }

      if (currentBaker?.address === selectedBaker.address) {
        showErrorToast({
          title: 'Re-delegation is not possible',
          description: `Already delegated funds to this ${isDcpNode ? 'producer' : 'baker'}.`
        });
      } else if (new BigNumber(tezosBalance).isZero() && canUseOnRamp) {
        dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Continue));
      } else {
        navigate(ModalsEnum.Confirmation, {
          type: ConfirmationTypeEnum.InternalOperations,
          opParams: [{ kind: OpKind.DELEGATION, delegate: selectedBaker.address, source: accountPkh }],
          ...(isRecommendedBakerSelected && { testID: 'RECOMMENDED_BAKER_DELEGATION' }),
          ...(isHelpUkraineBakerSelected && { testID: 'HELP_UKRAINE_BAKER_DELEGATION' }),
          ...(Boolean(selectedBaker.isUnknownBaker) && !isDcpNode && { disclaimerMessage: DISCLAIMER_MESSAGE })
        });
      }
    }
  };

  const handleSortValueChange = (value: BakersSortFieldEnum) => setSortValue(value);

  useEffect(() => {
    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: BakerInterface[] = [];

      for (const baker of activeBakers) {
        const { name, address } = baker;

        if (name.toLowerCase().includes(lowerCaseSearchValue) || address.toLowerCase().includes(lowerCaseSearchValue)) {
          result.push(baker);
        }
      }

      setFilteredBakersList(result);
    } else {
      setFilteredBakersList(activeBakers);
    }
  }, [searchValue, activeBakers]);

  const sortedBakersList = useMemo(() => {
    switch (sortValue) {
      case BakersSortFieldEnum.Rank:
        return filteredBakersList;
      case BakersSortFieldEnum.Fee:
        return [...filteredBakersList].sort((a, b) => a.delegation.fee - b.delegation.fee);
      case BakersSortFieldEnum.Staking:
        return [...filteredBakersList].sort(
          (a, b) => b.delegation.capacity - b.delegation.freeSpace - (a.delegation.capacity - a.delegation.freeSpace)
        );
      default:
        return [...filteredBakersList].sort((a, b) => b.delegation.freeSpace - a.delegation.freeSpace);
    }
  }, [filteredBakersList, sortValue]);

  const finalBakersList = useMemo(
    () => recommendedBakers.concat(sortedBakersList),
    [recommendedBakers, sortedBakersList]
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
          data={finalBakersList}
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

      <View style={isDcpNode && styles.buttons}>
        <ModalButtonsContainer>
          <ButtonLargeSecondary title="Close" onPress={goBack} testID={SelectBakerModalSelectors.closeButton} />
          <Divider size={formatSize(16)} />
          <ButtonLargePrimary
            title="Next"
            disabled={!isDefined(selectedBaker) || !isValidAddress(selectedBaker.address)}
            onPress={handleNextPress}
            testID={SelectBakerModalSelectors.nextButton}
          />
        </ModalButtonsContainer>
      </View>

      <OnRampOverlay isStart={false} onClose={onOnRampOverlayClose} isOpen={onRampOverlayIsOpened} />
    </>
  );
});
