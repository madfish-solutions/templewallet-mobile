import React from 'react';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { SearchInput } from '../../components/search-input/search-input';

export const Activity = () => (
  <>
    <SearchInput placeholder="Search by address" />
    <ScreenContainer>
      <DataPlaceholder text="Activity will be available soon" />
    </ScreenContainer>
  </>
);
