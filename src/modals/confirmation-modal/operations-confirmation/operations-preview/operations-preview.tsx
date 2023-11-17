import { ParamsWithKind } from '@taquito/taquito';
import React, { FC } from 'react';

import { getParamPreview } from '../../../../utils/param-preview.utils';

import { OperationsPreviewItem } from './operations-preview-item/operations-preview-item';

interface Props {
  opParams: ParamsWithKind[];
}

export const OperationsPreview: FC<Props> = ({ opParams }) => {
  const operationsPreview = opParams.map(getParamPreview);

  return (
    <>
      {operationsPreview.map((operationPreview, index) => (
        <OperationsPreviewItem key={index} paramPreview={operationPreview} />
      ))}
    </>
  );
};
