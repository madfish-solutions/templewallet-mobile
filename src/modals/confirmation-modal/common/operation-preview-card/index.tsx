import React, { FC, ReactNode } from 'react';
import { View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';

import { OperationPreviewDescription } from '../operation-preview-description';

import { useOperationPreviewCardStyles } from './styles';

interface Props {
  /** When set, renders a robot icon before the description. */
  iconSeed?: string;
  iconSize?: number;
  /** Plain string uses {@link OperationPreviewDescription}; pass a node for richer left-side content. */
  description: ReactNode;
  /** Optional address shown on the right of the header row. */
  publicKeyHash?: string;
  children?: ReactNode;
}

export const OperationPreviewCard: FC<Props> = ({
  iconSeed,
  iconSize = formatSize(32),
  description,
  publicKeyHash,
  children
}) => {
  const styles = useOperationPreviewCardStyles();

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.infoContainer}>
          {isDefined(iconSeed) && (
            <>
              <RobotIcon seed={iconSeed} size={iconSize} />
              <Divider size={formatSize(10)} />
            </>
          )}
          {typeof description === 'string' ? (
            <OperationPreviewDescription>{description}</OperationPreviewDescription>
          ) : (
            description
          )}
        </View>
        {isDefined(publicKeyHash) && (
          <View style={styles.hashContainer}>
            <PublicKeyHashText publicKeyHash={publicKeyHash} />
          </View>
        )}
      </View>
      {children}
    </View>
  );
};
