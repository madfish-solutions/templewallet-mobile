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
import { conditionalStyle } from '../../utils/conditional-style';
import { isDefined } from '../../utils/is-defined';
import { isString } from '../../utils/is-string';
import { tzktUrl } from '../../utils/linking.util';
import { useToastStyles } from './toast.styles';

interface Props {
  onPress?: () => void;
  text1?: string;
  text2: string;
  hide: EmptyFn;
  toastType: ToastTypeEnum;
  props?: {
    operationHash?: string;
  };
}

export const CustomToast: FC<Props> = ({ onPress, text1, text2, hide, toastType, props }) => {
  const styles = useToastStyles(toastType)();
  const colors = useColors();

  const onPressHandler = () => {
    if (isDefined(onPress)) {
      onPress();
    }
    hide();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPressHandler}>
      <View style={styles.overlay}>
        <View style={styles.innerContent}>
          <Icon
            name={isString(text1) ? IconNameEnum.Success : IconNameEnum.AlertShield}
            color={toastType === ToastTypeEnum.Warning ? undefined : colors.white}
            style={styles.iconLeft}
          />
          <View style={[styles.textWrapper, conditionalStyle(!isDefined(onPress), { marginRight: formatSize(16) })]}>
            {isString(text1) && <Text style={styles.title}>{text1}</Text>}
            <Text numberOfLines={!isString(text1) ? 2 : 1} style={styles.description}>
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
          {isDefined(onPress) && (
            <Icon
              name={IconNameEnum.Navigation}
              color={toastType === ToastTypeEnum.Warning ? undefined : colors.white}
              style={styles.iconRight}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
