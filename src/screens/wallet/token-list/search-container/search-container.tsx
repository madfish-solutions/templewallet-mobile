import { debounce } from 'lodash-es';
import React, { FC, useState } from 'react';
import { TextInput, View } from 'react-native';

import { Divider } from '../../../../components/divider/divider';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../../components/icon/touchable-icon/touchable-icon';
import { EventFn } from '../../../../config/general';
import { ScreensEnum } from '../../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../../styles/format-size';
import { useColors } from '../../../../styles/use-colors';
import { useSearchContainerStyles } from './search-container.styles';

interface Props {
  onChange: EventFn<string | undefined>;
}

export const SearchContainer: FC<Props> = ({ onChange }) => {
  const { navigate } = useNavigation();
  const colors = useColors();
  const styles = useSearchContainerStyles();

  const [isSearchMode, setIsSearchMode] = useState(false);

  const debouncedOnChange = debounce(onChange);

  const handleSCirclePress = () => {
    setIsSearchMode(false);
    onChange(undefined);
  };

  return (
    <View style={styles.container}>
      {isSearchMode ? (
        <>
          <TextInput
            style={styles.searchInput}
            placeholder="Search token"
            placeholderTextColor={colors.gray1}
            onChangeText={debouncedOnChange}
          />
          <Divider size={formatSize(8)} />
          <TouchableIcon name={IconNameEnum.XCircle} size={formatSize(16)} onPress={handleSCirclePress} />
          <Divider size={formatSize(4)} />
        </>
      ) : (
        <>
          <TouchableIcon
            name={IconNameEnum.Clock}
            size={formatSize(16)}
            onPress={() => navigate(ScreensEnum.Activity)}
          />
          <Divider size={formatSize(24)} />
          <TouchableIcon
            name={IconNameEnum.Edit}
            size={formatSize(16)}
            onPress={() => navigate(ScreensEnum.ManageAssets)}
          />
          <Divider size={formatSize(24)} />
          <TouchableIcon name={IconNameEnum.Search} size={formatSize(16)} onPress={() => setIsSearchMode(true)} />
          <Divider size={formatSize(4)} />
        </>
      )}
    </View>
  );
};
