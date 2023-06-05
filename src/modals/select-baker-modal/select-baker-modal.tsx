import { OpKind } from '@taquito/taquito';
import { debounce } from 'lodash-es';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { BakerInterface, emptyBaker } from 'src/apis/baking-bad';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ModalButtonsContainer } from 'src/components/modal-buttons-container/modal-buttons-container';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { SearchInput } from 'src/components/search-input/search-input';
import { Sorter } from 'src/components/sorter/sorter';
import { BakersSortFieldEnum } from 'src/enums/bakers-sort-field.enum';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useBakersListSelector, useSelectedBakerSelector } from 'src/store/baking/baking-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { isValidAddress } from 'src/utils/tezos.util';

import { BakerListItem } from './baker-list-item/baker-list-item';
import { SelectBakerModalSelectors } from './select-baker-modal.selectors';
import { useSelectBakerModalStyles } from './select-baker-modal.styles';

export const RECOMMENDED_BAKER_ADDRESS = 'tz1aRoaRhSpRYvFdyvgWLL6TGyRoGF51wDjM';
export const HELP_UKRAINE_BAKER_ADDRESS = 'tz1bMFzs2aECPn4aCRmKQWHSLHF8ZnZbYcah';
const DISCLAIMER_MESSAGE =
  'Provided address is not known to us as a baker! Only delegate funds to it at your own risk.';

const TEZ_LABEL = 'Delegate to Recommended Bakers';
const TEZ_DESCRIPTION = 'Click on the Baker you want to delegate funds to. This list is powered by Baking Bad.';
const DCP_LABEL = 'Delegate to producer';
const DCP_DESCRIPTION =
  'Enter the address or domain name of a registered producer to whom you want to delegate your funds.';

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

export const SelectBakerModal: FC = () => {
  const { goBack, navigate } = useNavigation();
  const styles = useSelectBakerModalStyles();
  const [currentBaker] = useSelectedBakerSelector();
  const { isTezosNode, isDcpNode } = useNetworkInfo();
  const bakerNameByNode = isDcpNode ? 'Producer' : 'Baker';

  const searchPlaceholder = `Search ${bakerNameByNode}`;
  const UNKNOWN_BAKER_NAME = `Unknown ${bakerNameByNode}`;

  const { trackEvent } = useAnalytics();

  const selectedAccount = useSelectedAccountSelector();

  const bakersList = useBakersListSelector();
  const activeBakers = useMemo(() => bakersList.filter(baker => baker.serviceHealth === 'active'), [bakersList]);

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

      if (currentBaker.address === selectedBaker.address) {
        showErrorToast({
          title: 'Re-delegation is not possible',
          description: `Already delegated funds to this ${isDcpNode ? 'producer' : 'baker'}.`
        });
      } else {
        navigate(ModalsEnum.Confirmation, {
          type: ConfirmationTypeEnum.InternalOperations,
          opParams: [
            { kind: OpKind.DELEGATION, delegate: selectedBaker.address, source: selectedAccount.publicKeyHash }
          ],
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
        return [...filteredBakersList].sort((a, b) => a.fee - b.fee);
      case BakersSortFieldEnum.Staking:
        return [...filteredBakersList].sort((a, b) => (b.stakingBalance ?? 0) - (a.stakingBalance ?? 0));
      default:
        return [...filteredBakersList].sort((a, b) => (b.freeSpace ?? 0) - (a.freeSpace ?? 0));
    }
  }, [filteredBakersList, sortValue]);

  const finalBakersList = useMemo(
    () => recommendedBakers.concat(sortedBakersList),
    [recommendedBakers, sortedBakersList]
  );

  const isValidBakerAddress = isDefined(selectedBaker) && !isValidAddress(selectedBaker.address);

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
          {searchValue === selectedAccount.publicKeyHash && (
            <Text style={styles.errorText}>You can not delegate to yourself</Text>
          )}
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
          renderItem={({ item }) => (
            <BakerListItem
              item={item}
              selected={item.address === selectedBaker?.address}
              onPress={setSelectedBaker}
              testID={SelectBakerModalSelectors.bakerItem}
            />
          )}
          keyExtractor={item => item.address}
          style={styles.flatList}
          windowSize={10}
          ListEmptyComponent={
            searchValue?.toLowerCase() !== selectedAccount.publicKeyHash.toLowerCase() ? (
              <BakerListItem
                item={{ ...emptyBaker, name: UNKNOWN_BAKER_NAME, address: searchValue ?? '', isUnknownBaker: true }}
                onPress={setSelectedBaker}
                selected={searchValue === selectedBaker?.address}
              />
            ) : undefined
          }
        />
      )}

      {isDcpNode &&
        isValidAddress(searchValue ?? '') &&
        searchValue?.toLowerCase() !== selectedAccount.publicKeyHash.toLowerCase() && (
          <View style={styles.dcpBaker}>
            <Divider size={formatSize(16)} />
            <BakerListItem
              item={{ ...emptyBaker, name: UNKNOWN_BAKER_NAME, address: searchValue ?? '', isUnknownBaker: true }}
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
    </>
  );
};
