import { black } from '../../config/styles';
import { ToastTypeEnum } from '../../enums/toast-type.enum';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';
import { generateShadow } from '../../styles/generate-shadow';

export const useToastStyles = (toastType: ToastTypeEnum) =>
  createUseStyles(({ colors, typography }) => ({
    container: {
      ...generateShadow(1, black),
      width: formatSize(343),
      borderRadius: formatSize(8),
      backgroundColor: colors.toastBG
    },
    overlay: {
      borderRadius: formatSize(8),
      backgroundColor: colors[`${toastType}ToastOverlay`],
      flex: 1,
      justifyContent: 'center'
    },
    innerContent: {
      display: 'flex',
      flexDirection: 'row'
    },
    title: {
      ...typography.caption13Semibold,
      color: toastType === ToastTypeEnum.Warning ? colors.black : colors.white
    },
    description: {
      ...typography.caption13Regular,
      lineHeight: formatSize(20),
      color: toastType === ToastTypeEnum.Warning ? colors.black : colors.white
    },
    textWrapper: {
      flex: 1,
      marginVertical: 10
    },
    operationHashBlock: {
      flexDirection: 'row'
    },
    iconLeft: {
      margin: formatSize(10)
    },
    iconRight: {
      margin: formatSize(10)
    }
  }));
