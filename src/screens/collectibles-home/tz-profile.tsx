import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, Text, TouchableOpacity, View } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { SocialButton } from 'src/components/social-button';
import { formatSize } from 'src/styles/format-size';
import { openUrl } from 'src/utils/linking';
import { useTzProfile } from 'src/utils/tz-profiles';

import { useCollectiblesHomeProfileStyles } from './styles';

interface Props {
  accountPkh: string;
}

interface SocialLinksInterface {
  url: string | nullish;
  icon: IconNameEnum;
}

export const TzProfileView = memo<Props>(({ accountPkh }) => {
  const tzProfile = useTzProfile(accountPkh);

  const styles = useCollectiblesHomeProfileStyles();

  const openTzProfiles = () => openUrl('https://tzprofiles.com/');

  const socialLinks = useMemo<SocialLinksInterface[]>(
    () =>
      [
        { url: tzProfile?.twitter, icon: IconNameEnum.Twitter },
        { url: tzProfile?.discord, icon: IconNameEnum.Discord },
        { url: tzProfile?.website, icon: IconNameEnum.Website },
        { url: tzProfile?.github, icon: IconNameEnum.Github }
      ].sort((a, b) => {
        if (!a.url) {
          return 1;
        }
        if (!b.url) {
          return -1;
        }

        return 0;
      }),
    [tzProfile]
  );

  const renderSocialLinkItem: ListRenderItem<SocialLinksInterface> = useCallback(
    ({ item }) => (
      <SocialButton
        iconName={item.icon}
        url={item.url}
        style={styles.socialsIcon}
        size={formatSize(15)}
        copyOnPress={item.icon === IconNameEnum.Discord}
      />
    ),
    [styles.socialsIcon]
  );

  return (
    <View style={styles.profileActions}>
      <TouchableOpacity onPress={openTzProfiles} style={styles.profileActionButton}>
        <Icon name={tzProfile ? IconNameEnum.EditNew : IconNameEnum.PlusCircleNew} size={formatSize(24)} />
        <Text style={styles.profileText}>{tzProfile ? 'EDIT PROFILE' : 'CREATE PROFILE'}</Text>
      </TouchableOpacity>

      <FlatList data={socialLinks} renderItem={renderSocialLinkItem} horizontal={true} />
    </View>
  );
});
