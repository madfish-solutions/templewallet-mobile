import React, { memo } from 'react';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';
import { TruncatedText } from 'src/components/truncated-text';
import { formatSize } from 'src/styles/format-size';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';

import { useCopyAddressModalStyles } from './styles';

export interface CopyAddressOption {
  label: string;
  address: string;
  iconName: IconNameEnum;
}

interface Props {
  isVisible: boolean;
  options: CopyAddressOption[];
  onClose: EmptyFn;
}

export const CopyAddressModal = memo<Props>(({ isVisible, options, onClose }) => {
  const styles = useCopyAddressModalStyles();

  const handleOptionPress = (address: string) => {
    copyStringToClipboard(address);
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <Text style={styles.title}>Copy address</Text>

              {options.map(({ label, address, iconName }) => (
                <React.Fragment key={label}>
                  <SafeTouchableOpacity style={styles.option} onPress={() => handleOptionPress(address)}>
                    <View style={styles.optionInfo}>
                      <Text style={styles.optionLabel}>{label}</Text>
                      <TruncatedText ellipsizeMode="middle" style={styles.optionAddress}>
                        {address}
                      </TruncatedText>
                    </View>

                    <View style={styles.iconContainer}>
                      <Icon name={iconName} size={formatSize(16)} />
                    </View>
                  </SafeTouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});
