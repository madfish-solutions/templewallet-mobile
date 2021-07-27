import React, { FC } from 'react';

import { ParamsWithKind } from '../../../../interfaces/op-params.interface';
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
