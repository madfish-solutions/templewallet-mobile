import React, { FC, useState } from 'react';

import { ButtonMedium } from 'src/components/button/button-medium/button-medium';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { AsyncStorageDetails } from './async-storage-details';
import { ImportWatchOnlyDebug } from './import-watch-only-debug/import-watch-only-debug';

export const Debug: FC = () => {
  const [shouldThrowRenderError, setShouldThrowRenderError] = useState(false);

  const handleThrowRenderErrorButtonsPress = () => {
    setShouldThrowRenderError(true);
  };

  usePageAnalytic(ScreensEnum.Debug);

  const handleThrowErrorButtonsPress = () => {
    throw new Error('Test error from Debug screen');
  };

  return (
    <ScreenContainer>
      <ImportWatchOnlyDebug />
      <Divider size={formatSize(50)} />
      <ButtonMedium title="Throw Test Error" iconName={IconNameEnum.Alert} onPress={handleThrowErrorButtonsPress} />
      <Divider />
      <ButtonMedium
        title="Throw Test Render Error"
        iconName={IconNameEnum.Alert}
        onPress={handleThrowRenderErrorButtonsPress}
      />
      {shouldThrowRenderError && <RenderError />}
      <Divider />
      <AsyncStorageDetails />
    </ScreenContainer>
  );
};

const RenderError = () => {
  throw new Error('Test render error from Debug screen');
};
