import React, { useState } from 'react';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { Button, FlatList, Image, Text, View } from 'react-native';
import { MAINNET_TOKENS } from '../../constants/main-net-tokens';

export const Wallet = () => {
  const [data] = useState(MAINNET_TOKENS);
  return (
    <ScreenContainer>
      <Button title={'Send'} onPress={() => null}></Button>
      <Button title={'Receive'} onPress={() => null}></Button>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
            {item.iconUrl && <Image source={{ uri: item.iconUrl }} style={{ width: 30, height: 30 }} />}
            <Text style={{ marginLeft: 10 }}>{item.name}</Text>
          </View>
        )}
      />
    </ScreenContainer>
  );
};
