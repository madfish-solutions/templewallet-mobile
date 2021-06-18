import React, { FC, Fragment, useMemo } from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../../../../components/divider/divider';
import { PublicKeyHashText } from '../../../../../components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from '../../../../../components/robot-icon/robot-icon';
import { ParamPreviewTypeEnum } from '../../../../../enums/param-preview-type.enum';
import { ParamPreviewInterface } from '../../../../../interfaces/param-preview.interface';
import { formatSize } from '../../../../../styles/format-size';
import { isDefined } from '../../../../../utils/is-defined';
import { useOperationsPreviewItemStyles } from './operations-preview-item.styles';

interface Props {
  paramPreview: ParamPreviewInterface;
}

interface PreviewDataInterface {
  iconSeed: string;
  description: string;
  hash?: string;
}

export const OperationsPreviewItem: FC<Props> = ({ paramPreview }) => {
  const styles = useOperationsPreviewItemStyles();

  const previewData = useMemo<PreviewDataInterface[]>(() => {
    switch (paramPreview.type) {
      case ParamPreviewTypeEnum.Send:
        return paramPreview.transfers.map(transfer => ({
          iconSeed: transfer.recipient,
          description: 'Transfer to',
          hash: transfer.recipient
        }));
      case ParamPreviewTypeEnum.Delegate:
        return [{ iconSeed: paramPreview.baker, description: 'Delegate to', hash: paramPreview.baker }];
      case ParamPreviewTypeEnum.FA1_2Approve:
        return [{ iconSeed: paramPreview.approveTo, description: 'Approve to', hash: paramPreview.approveTo }];
      case ParamPreviewTypeEnum.ContractCall:
        return [
          {
            iconSeed: paramPreview.contract,
            description: `${paramPreview.entrypoint} method call`,
            hash: paramPreview.contract
          }
        ];
      case ParamPreviewTypeEnum.Other:
        return [{ iconSeed: paramPreview.opKind, description: paramPreview.opKind }];
    }
  }, [paramPreview]);

  return (
    <>
      {previewData.map(({ iconSeed, description, hash }, index) => (
        <Fragment key={iconSeed + index}>
          <View style={styles.container}>
            <View style={styles.infoContainer}>
              <RobotIcon seed={iconSeed} />
              <Divider size={formatSize(10)} />
              <Text style={styles.description}>{description}</Text>
            </View>
            {isDefined(hash) && <PublicKeyHashText publicKeyHash={hash} />}
          </View>
          <Divider size={formatSize(8)} />
        </Fragment>
      ))}
    </>
  );
};
