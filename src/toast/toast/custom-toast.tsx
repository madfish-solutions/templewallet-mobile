import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { white } from 'src/config/styles';
import { ToastTypeEnum } from 'src/enums/toast-type.enum';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { tzktUrl } from 'src/utils/linking';
import { hexa } from 'src/utils/style.util';

import { useToastStyles } from './toast.styles';

interface Props {
  title?: string;
  description?: string;
  iconName?: IconNameEnum;
  hide: EmptyFn;
  toastType: ToastTypeEnum;
  operationHash?: string;
  isCopyButtonVisible?: boolean;
  onPress: EmptyFn;
}

const iconNameMap: Record<string, IconNameEnum> = {
  [ToastTypeEnum.Success]: IconNameEnum.Success,
  [ToastTypeEnum.Warning]: IconNameEnum.AlertCircle,
  [ToastTypeEnum.Error]: IconNameEnum.AlertTriangle
};

export const CustomToast: FC<Props> = ({
  title,
  description,
  iconName,
  hide,
  toastType,
  operationHash,
  isCopyButtonVisible,
  onPress
}) => {
  const styles = useToastStyles();
  const colors = useColors();

  const selectedRpcUrl = useSelectedRpcUrlSelector();

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
            name={iconName ?? iconNameMap[toastType]}
            size={formatSize(16)}
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
                numberOfLines={2}
                style={[
                  styles.description,
                  { color: toastType === ToastTypeEnum.Warning ? colors.black : colors.white }
                ]}
              >
                {description}
              </Text>
              {isCopyButtonVisible === true && (
                <View style={styles.copyIconContainer}>
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
                <ExternalLinkButton url={tzktUrl(selectedRpcUrl, operationHash)} />
              </View>
            )}
          </View>
          <Divider size={formatSize(16)} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
