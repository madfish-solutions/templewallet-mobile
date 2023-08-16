import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Checkbox } from 'src/components/checkbox/checkbox';
import { Divider } from 'src/components/divider/divider';
import { Search } from 'src/components/search/search';
import { Sorter } from 'src/components/sorter/sorter';
import { EventFn } from 'src/config/general';
import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { formatSize } from 'src/styles/format-size';

import { useEarnOpportunitySearchPanelStyles } from './styles';

interface Props {
  checkboxTestID?: string;
  searchTestID?: string;
  sorterTestID?: string;
  sortField: EarnOpportunitiesSortFieldEnum;
  depositedOnly: boolean;
  handleToggleDepositOnly: EventFn<boolean>;
  setSearchValue: EventFn<string | undefined>;
  handleSetSortField: EventFn<EarnOpportunitiesSortFieldEnum>;
}

const earnSortFieldsLabels = {
  [EarnOpportunitiesSortFieldEnum.Default]: 'Default',
  [EarnOpportunitiesSortFieldEnum.APR]: 'APR',
  [EarnOpportunitiesSortFieldEnum.Oldest]: 'Oldest',
  [EarnOpportunitiesSortFieldEnum.Newest]: 'Newest'
};

const earnSortFieldsOptions = [
  EarnOpportunitiesSortFieldEnum.Default,
  EarnOpportunitiesSortFieldEnum.APR,
  EarnOpportunitiesSortFieldEnum.Oldest,
  EarnOpportunitiesSortFieldEnum.Newest
];

export const EarnOpportunitySearchPanel: FC<Props> = ({
  checkboxTestID,
  searchTestID,
  sorterTestID,
  sortField,
  depositedOnly,
  handleToggleDepositOnly,
  setSearchValue,
  handleSetSortField
}) => {
  const styles = useEarnOpportunitySearchPanelStyles();

  return (
    <View style={[styles.row, styles.container]}>
      <View style={styles.row}>
        <Checkbox
          value={depositedOnly}
          size={formatSize(16)}
          strokeWidth={formatSize(2)}
          onChange={handleToggleDepositOnly}
          testID={checkboxTestID}
        >
          <Divider size={formatSize(4)} />
          <Text style={styles.depositText}>Deposited only</Text>
        </Checkbox>
      </View>
      <Search placeholder="Search farm" onChange={setSearchValue} dividerSize={12} testID={searchTestID}>
        <Sorter
          bottomSheetContentHeight={264}
          sortValue={sortField}
          description="Sort by:"
          sortFieldsOptions={earnSortFieldsOptions}
          sortFieldsLabels={earnSortFieldsLabels}
          onSetSortValue={handleSetSortField}
          testID={sorterTestID}
        />
      </Search>
    </View>
  );
};
