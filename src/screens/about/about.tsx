import React from 'react';
import { Text, View } from 'react-native';
import { isTablet } from 'react-native-device-info';

import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { OctopusWithLove } from '../../components/octopus-with-love/octopus-with-love';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { WhiteContainer } from '../../components/white-container/white-container';
import { WhiteContainerAction } from '../../components/white-container/white-container-action/white-container-action';
import { WhiteContainerDivider } from '../../components/white-container/white-container-divider/white-container-divider';
import { WhiteContainerText } from '../../components/white-container/white-container-text/white-container-text';
import {
  contact,
  featureRequest,
  knowledgeBase,
  privacyPolicy,
  repository,
  termsOfUse,
  website
} from '../../config/socials';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { openUrl } from '../../utils/linking';

import { useAboutStyles } from './about.styles';
import { AboutPageSelectors } from './selectors';

export const About = () => {
  const styles = useAboutStyles();
  usePageAnalytic(ScreensEnum.About);

  return (
    <ScreenContainer isFullScreenMode={true}>
      <View>
        <WhiteContainer>
          <WhiteContainerAction testID={AboutPageSelectors.knowledgeBase} onPress={() => openUrl(knowledgeBase)}>
            <WhiteContainerText text="Knowledge Base" />
            <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
          </WhiteContainerAction>
          <WhiteContainerDivider />
          <WhiteContainerAction testID={AboutPageSelectors.featureRequest} onPress={() => openUrl(featureRequest)}>
            <WhiteContainerText text="Feature Request" />
            <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
          </WhiteContainerAction>
        </WhiteContainer>
        <Divider size={formatSize(16)} />

        <WhiteContainer>
          <WhiteContainerAction testID={AboutPageSelectors.website} onPress={() => openUrl(website)}>
            <WhiteContainerText text="Website" />
            <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
          </WhiteContainerAction>
          <WhiteContainerDivider />
          <WhiteContainerAction testID={AboutPageSelectors.repository} onPress={() => openUrl(repository)}>
            <WhiteContainerText text="Repository" />
            <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
          </WhiteContainerAction>
          <WhiteContainerDivider />
          <WhiteContainerAction testID={AboutPageSelectors.privacyPolicy} onPress={() => openUrl(privacyPolicy)}>
            <WhiteContainerText text="Privacy Policy" />
            <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
          </WhiteContainerAction>
          <WhiteContainerDivider />
          <WhiteContainerAction testID={AboutPageSelectors.termsOfUse} onPress={() => openUrl(termsOfUse)}>
            <WhiteContainerText text="Terms of Use" />
            <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
          </WhiteContainerAction>
          <WhiteContainerDivider />
          <WhiteContainerAction testID={AboutPageSelectors.contact} onPress={() => openUrl(contact)}>
            <WhiteContainerText text="Contact" />
            <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
          </WhiteContainerAction>
        </WhiteContainer>
        <Divider />
      </View>

      <View>
        {!isTablet() && <OctopusWithLove />}

        <Divider size={formatSize(16)} />
        <Text style={styles.openSourceText}>
          <Text style={styles.templeWalletText}>Temple Wallet</Text> - Open Source Project
        </Text>
      </View>
    </ScreenContainer>
  );
};
