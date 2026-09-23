import React, { FC } from 'react';

import { TruncatedText } from 'src/components/truncated-text';

import { useOperationPreviewDescriptionStyles } from './styles';

interface Props {
  children: string;
}

export const OperationPreviewDescription: FC<Props> = ({ children }) => {
  const styles = useOperationPreviewDescriptionStyles();

  return <TruncatedText style={styles.description}>{children}</TruncatedText>;
};
