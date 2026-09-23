import { identity } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ListRenderItemInfo, ScrollView, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export interface FallbackDemoProps<S> {
  networkName: string;
  createSubscription: (
    setMessages: React.Dispatch<React.SetStateAction<string[]>>,
    setUsedRpcUrl: React.Dispatch<React.SetStateAction<string>>
  ) => S;
  destroySubscription: SyncFn<S>;
  initialRpcUrl: string | (() => string);
}

export const FallbackDemo = <S extends unknown>({
  networkName,
  createSubscription,
  destroySubscription,
  initialRpcUrl
}: FallbackDemoProps<S>) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [usedRpcUrl, setUsedRpcUrl] = useState(initialRpcUrl);
  const styles = useStyles();
  const scrollViewRef = useRef<ScrollView>(null);

  const renderMessageItem = useCallback(
    (info: ListRenderItemInfo<string>) => <Text style={styles.messageText}>{info.item}</Text>,
    [styles]
  );

  useEffect(() => {
    const updateMessages: typeof setMessages = input => {
      setMessages(input);
      scrollViewRef.current?.scrollToEnd();
    };

    const subscription = createSubscription(updateMessages, setUsedRpcUrl);

    return () => destroySubscription(subscription);
  }, [createSubscription, destroySubscription]);

  return (
    <View>
      <Text>
        Used {networkName} RPC URL: {usedRpcUrl}
      </Text>
      <Text>Messages:</Text>
      <ScrollView style={styles.messagesContainer} ref={scrollViewRef}>
        <FlatList data={messages} renderItem={renderMessageItem} keyExtractor={identity} />
      </ScrollView>
    </View>
  );
};

const useStyles = createUseStylesMemoized(({ colors, typography }) => ({
  messagesContainer: {
    padding: formatSize(8),
    gap: formatSize(4),
    borderColor: colors.lines,
    borderWidth: DEFAULT_BORDER_WIDTH,
    height: formatSize(300)
  },
  messageText: {
    ...typography.numbersRegular13,
    color: colors.black
  }
}));
