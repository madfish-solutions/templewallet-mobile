import React from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import {
  contact,
  featureRequest,
  knowledgeBase,
  privacyPolicy,
  repository,
  termsOfUse,
  website
} from '../../config/socials';
import { formatSize } from '../../styles/format-size';
import { openUrl } from '../../utils/linking.util';
import { MadeWithLove } from '../settings/made-with-love/made-with-love';
import { WhiteContainer } from '../settings/white-container/white-container';
import { WhiteContainerAction } from '../settings/white-container/white-container-action/white-container-action';
import { WhiteContainerDivider } from '../settings/white-container/white-container-divider/white-container-divider';
import { WhiteContainerText } from '../settings/white-container/white-container-text/white-container-text';
import { useAboutStyles } from './about.styles';

export const About = () => {
  const styles = useAboutStyles();

  return (
    <ScreenContainer isFullScreenMode={true}>
      <View>
        <WhiteContainer>
          <WhiteContainerAction onPress={() => openUrl(knowledgeBase)}>
            <WhiteContainerText text="Knowledge Base" />
            <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
          </WhiteContainerAction>
          <WhiteContainerDivider />
          <WhiteContainerAction onPress={() => openUrl(featureRequest)}>
            <WhiteContainerText text="Feature Request" />
            <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
          </WhiteContainerAction>
        </WhiteContainer>
        <Divider size={formatSize(16)} />

        <WhiteContainer>
          <WhiteContainerAction onPress={() => openUrl(website)}>
            <WhiteContainerText text="Website" />
            <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
          </WhiteContainerAction>
          <WhiteContainerDivider />
          <WhiteContainerAction onPress={() => openUrl(repository)}>
            <WhiteContainerText text="Repository" />
            <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
          </WhiteContainerAction>
          <WhiteContainerDivider />
          <WhiteContainerAction onPress={() => openUrl(privacyPolicy)}>
            <WhiteContainerText text="Privacy Policy" />
            <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
          </WhiteContainerAction>
          <WhiteContainerDivider />
          <WhiteContainerAction onPress={() => openUrl(termsOfUse)}>
            <WhiteContainerText text="Terms of Use" />
            <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
          </WhiteContainerAction>
          <WhiteContainerDivider />
          <WhiteContainerAction onPress={() => openUrl(contact)}>
            <WhiteContainerText text="Contact" />
            <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
          </WhiteContainerAction>
        </WhiteContainer>
        <Divider />
      </View>

      <View>
        <MadeWithLove />
        <Divider size={formatSize(16)} />
        <Text style={styles.openSourceText}>
          <Text style={styles.templeWalletText}>Temple Wallet</Text> - Open Source Project
        </Text>
      </View>
    </ScreenContainer>
  );
};
