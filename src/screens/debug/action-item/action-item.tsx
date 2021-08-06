import React, { FC, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
// eslint-disable-next-line import/default
import JSONTree from 'react-native-json-tree';

import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { RecentActionPayload } from '../../../interfaces/action-arrival-payload.interface';
import { formatSize } from '../../../styles/format-size';
import { conditionalStyle } from '../../../utils/conditional-style';
import { useActionItemStyles } from './action-item.styles';

export const ActionItem: FC<RecentActionPayload> = ({ timestamp, type, payload }) => {
  const [showPayload, setShowPayload] = useState(false);
  const styles = useActionItemStyles();

  const dateTimeStr = useMemo(() => {
    const date = new Date(timestamp);

    const mainPart = date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    return `${mainPart}.${date.getMilliseconds().toString().padStart(3, '0')}`;
  }, [timestamp]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => setShowPayload(prevValue => !prevValue)}>
        <Text style={styles.title}>
          {dateTimeStr} {type}
        </Text>
        <Icon
          style={conditionalStyle(showPayload, styles.openedAccordionIcon)}
          name={IconNameEnum.TriangleDown}
          size={formatSize(24)}
        />
      </TouchableOpacity>
      {showPayload && (
        <View style={styles.body}>
          <JSONTree data={payload} />
        </View>
      )}
    </View>
  );
};
