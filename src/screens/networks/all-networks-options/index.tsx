import { capitalize } from 'lodash-es';
import { memo, useCallback } from 'react';
import { Text, View } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { formatSize } from 'src/styles/format-size';
import { AllNetworksOptionId } from 'src/types/networks';

import { NetworksSelectors } from '../selectors';

import { useAllNetworksOptionsStyles } from './styles';

interface AllNetworksOptionsProps {
  onSelect: SyncFn<AllNetworksOptionId>;
}

const optionsPropsBase = [
  { id: 'tezos', iconName: IconNameEnum.TezToken },
  { id: 'etherlink', iconName: IconNameEnum.EtherlinkToken }
] as const;

export const AllNetworksOptions = memo<AllNetworksOptionsProps>(({ onSelect }) => {
  const styles = useAllNetworksOptionsStyles();

  return (
    <View style={styles.container}>
      {optionsPropsBase.map(({ id, iconName }) => (
        <AllNetworksOption key={id} id={id} iconName={iconName} onClick={onSelect} />
      ))}
    </View>
  );
});

interface AllNetworksOptionProps {
  id: AllNetworksOptionId;
  iconName: IconNameEnum;
  onClick: SyncFn<AllNetworksOptionId>;
}

const AllNetworksOption = memo<AllNetworksOptionProps>(({ id, iconName, onClick }) => {
  const styles = useAllNetworksOptionsStyles();

  const handlePress = useCallback(() => onClick(id), [id, onClick]);

  return (
    <TouchableWithAnalytics
      style={styles.option}
      onPress={handlePress}
      testID={NetworksSelectors.networkOption}
      testIDProperties={{ network: id }}
    >
      <Icon name={iconName} size={formatSize(30)} style={styles.optionIcon} />
      <Text style={styles.optionName}>{capitalize(id)}</Text>
      <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
    </TouchableWithAnalytics>
  );
});
