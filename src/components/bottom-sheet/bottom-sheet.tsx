import React, { FC, useEffect, useRef } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { BlackPortal } from 'react-native-portal';
import ReanimatedBottomSheet from 'reanimated-bottom-sheet';

import { white } from '../../config/styles';
import { isDefined } from '../../utils/is-defined';

export const BOTTOM_SHEET_PORTAL_NAME = 'bottom-sheet';

interface Props {
  isOpen: boolean;
}

export const BottomSheet: FC<Props> = ({ isOpen }) => {
  const sheetRef = useRef<ReanimatedBottomSheet>(null);
  const height = useWindowDimensions().height - 80;

  useEffect(() => void (isDefined(sheetRef.current) && sheetRef.current.snapTo(isOpen ? 0 : 1)), [isOpen]);

  const renderContent = () => (
    <View style={{ height: '100%', backgroundColor: white }}>
      <Text>Hello</Text>
    </View>
  );

  return (
    <BlackPortal name={BOTTOM_SHEET_PORTAL_NAME}>
      <ReanimatedBottomSheet
        ref={sheetRef}
        initialSnap={0}
        snapPoints={[height, 0]}
        callbackThreshold={0.4}
        enabledContentTapInteraction={false}
        renderContent={renderContent}
      />
    </BlackPortal>
  );
};
