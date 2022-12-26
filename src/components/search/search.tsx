import { debounce } from 'lodash-es';
import React, { FC, useState } from 'react';
import { View, TextInput } from 'react-native';

import { EventFn } from '../../config/general';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { Divider } from '../divider/divider';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { useSearchStyles } from './search.styles';

interface Props {
  dividerSize?: number;
  onChange: EventFn<string | undefined>;
}

export const Search: FC<Props> = ({ dividerSize = 24, onChange, children }) => {
  const colors = useColors();
  const styles = useSearchStyles();
  const debouncedOnChange = debounce(onChange);

  const [isSearchMode, setIsSearchMode] = useState(false);

  const handleSCirclePress = () => {
    setIsSearchMode(false);
    onChange(undefined);
  };

  return (
    <View style={styles.container}>
      {isSearchMode ? (
        <>
          <TextInput
            autoFocus={true}
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
          {children}
          <Divider size={formatSize(dividerSize)} />
          <TouchableIcon name={IconNameEnum.Search} size={formatSize(16)} onPress={() => setIsSearchMode(true)} />
        </>
      )}
    </View>
  );
};
