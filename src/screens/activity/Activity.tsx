import React from 'react';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { SearchInput } from '../../components/search-input/search-input';

export const Activity = () => {
  return (
    <ScreenContainer>
      <SearchInput placeholder="Search by address" />
      <DataPlaceholder text="Activity will be available soon" />
    </ScreenContainer>
  );
};
