import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from '../../components/divider/divider';
import { ExternalLinkButton } from '../../components/icon/external-link-button/external-link-button';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { PublicKeyHashText } from '../../components/public-key-hash-text/public-key-hash-text';
import { EmptyFn } from '../../config/general';
import { white } from '../../config/styles';
import { ToastTypeEnum } from '../../enums/toast-type.enum';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { isDefined } from '../../utils/is-defined';
import { isString } from '../../utils/is-string';
import { tzktUrl } from '../../utils/linking.util';
import { hexa } from '../../utils/style.util';
import { useToastStyles } from './toast.styles';

interface Props {
  title?: string;
  description?: string;
  hide: EmptyFn;
  toastType: ToastTypeEnum;
  operationHash?: string;
  isCopyButtonVisible?: boolean;
  onPress: EmptyFn;
}

export const CustomToast: FC<Props> = ({
  title,
  description,
  hide,
  toastType,
  operationHash,
  isCopyButtonVisible,
  onPress
}) => {
  const styles = useToastStyles();
  const colors = useColors();

  const backgroundColorMap: Record<string, string> = {
    [ToastTypeEnum.Success]: colors.adding,
    [ToastTypeEnum.Warning]: hexa(colors.peach, 0.1),
    [ToastTypeEnum.Error]: colors.destructive
  };

  const handlePress = () => {
    onPress();
    hide();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={[styles.overlay, { backgroundColor: backgroundColorMap[toastType] }]}>
        <View style={styles.innerContent}>
          <Icon
            name={toastType === ToastTypeEnum.Success ? IconNameEnum.Success : IconNameEnum.AlertShield}
            style={styles.iconLeft}
            {...(toastType !== ToastTypeEnum.Warning && { color: colors.white })}
          />
          <View style={styles.textWrapper}>
            {isString(title) && (
              <Text
                style={[styles.title, { color: toastType === ToastTypeEnum.Warning ? colors.black : colors.white }]}
              >
                {title}
              </Text>
            )}
            <View style={styles.row}>
              <Text
                numberOfLines={!isString(title) ? 2 : 1}
                style={[
                  styles.description,
                  { color: toastType === ToastTypeEnum.Warning ? colors.black : colors.white }
                ]}
              >
                {description}
              </Text>
              {isCopyButtonVisible === true && (
                <View style={styles.iconContainer}>
                  <Icon name={IconNameEnum.Copy} color={white} />
                </View>
              )}
            </View>
            {isDefined(operationHash) && (
              <View style={styles.row}>
                <Text style={styles.description}>Operation hash:</Text>
                <Divider size={formatSize(8)} />
                <PublicKeyHashText publicKeyHash={operationHash} />
                <Divider size={formatSize(4)} />
                <ExternalLinkButton url={tzktUrl(operationHash)} />
              </View>
            )}
          </View>
          <Divider size={formatSize(16)} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
