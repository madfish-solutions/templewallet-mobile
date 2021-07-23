import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from '../../components/divider/divider';
import { ExternalLinkButton } from '../../components/icon/external-link-button/external-link-button';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { PublicKeyHashText } from '../../components/public-key-hash-text/public-key-hash-text';
import { EmptyFn } from '../../config/general';
import { ToastTypeEnum } from '../../enums/toast-type.enum';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { isDefined } from '../../utils/is-defined';
import { isString } from '../../utils/is-string';
import { tzktUrl } from '../../utils/linking.util';
import { hexa } from '../../utils/style.util';
import { useToastStyles } from './toast.styles';

interface Props {
  onPress?: EmptyFn;
  text1?: string;
  text2: string;
  hide: EmptyFn;
  toastType: ToastTypeEnum;
  props?: {
    operationHash?: string;
  };
}

export const CustomToast: FC<Props> = ({ onPress, text1, text2, hide, toastType, props }) => {
  const styles = useToastStyles();
  const colors = useColors();

  const backgroundColorMap: { [key: string]: string } = {
    [ToastTypeEnum.Success]: colors.adding,
    [ToastTypeEnum.Warning]: hexa(colors.peach, 0.1),
    [ToastTypeEnum.Error]: colors.destructive
  };

  const handlePress = () => {
    if (isDefined(onPress)) {
      onPress();
    }
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
            {isString(text1) && (
              <Text
                style={[styles.title, { color: toastType === ToastTypeEnum.Warning ? colors.black : colors.white }]}>
                {text1}
              </Text>
            )}
            <Text
              numberOfLines={!isString(text1) ? 2 : 1}
              style={[
                styles.description,
                { color: toastType === ToastTypeEnum.Warning ? colors.black : colors.white }
              ]}>
              {text2}
            </Text>
            {isDefined(props) && isDefined(props.operationHash) && (
              <View style={styles.operationHashBlock}>
                <Text style={styles.description}>Operation hash:</Text>
                <Divider size={formatSize(8)} />
                <PublicKeyHashText publicKeyHash={props.operationHash} />
                <Divider size={formatSize(4)} />
                <ExternalLinkButton url={tzktUrl(props.operationHash)} />
              </View>
            )}
          </View>
          {isDefined(onPress) ? (
            <Icon
              name={IconNameEnum.Navigation}
              {...(toastType !== ToastTypeEnum.Warning && { color: colors.white })}
              style={styles.iconRight}
            />
          ) : (
            <Divider size={formatSize(16)} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
