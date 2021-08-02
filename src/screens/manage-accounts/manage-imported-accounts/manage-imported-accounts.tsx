import React from 'react';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { Divider } from '../../../components/divider/divider';
import { IconButton } from '../../../components/icon-button/icon-button';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { SearchInput } from '../../../components/search-input/search-input';
import { ModalsEnum } from '../../../navigator/enums/modals.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { InfoText } from '../info-text/info-text';

export const ManageImportedAccounts = () => {
  const { navigate } = useNavigation();

  return (
    <>
      <SearchInput placeholder="Search accounts" />
      <Divider size={formatSize(12)} />
      <InfoText />
      <Divider size={formatSize(10)} />
      <IconButton icon={IconNameEnum.DownloadCloud} text="import" onPress={() => navigate(ModalsEnum.ImportAccount)} />
      <DataPlaceholder text="No found accounts" />
    </>
  );
};
