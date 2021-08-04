import { ParamPreviewTypeEnum } from '../enums/param-preview-type.enum';

export type ParamPreviewInterface =
  | SendParamPreviewInterface
  | DelegateParamPreviewInterface
  | FA1_2ApproveParamPreviewInterface
  | ContractCallParamPreviewInterface
  | OtherParamPreviewInterface;

interface ParamPreviewBaseInterface {
  type: ParamPreviewTypeEnum;
}

interface SendParamPreviewInterface extends ParamPreviewBaseInterface {
  type: ParamPreviewTypeEnum.Send;
  transfers: {
    asset: Asset;
    recipient: string;
    amount: string;
  }[];
}

interface DelegateParamPreviewInterface extends ParamPreviewBaseInterface {
  type: ParamPreviewTypeEnum.Delegate;
  baker: string;
}

interface FA1_2ApproveParamPreviewInterface extends ParamPreviewBaseInterface {
  type: ParamPreviewTypeEnum.FA1_2Approve;
  asset: Asset;
  approveTo: string;
  amount: string;
}

interface ContractCallParamPreviewInterface extends ParamPreviewBaseInterface {
  type: ParamPreviewTypeEnum.ContractCall;
  contract: string;
  entrypoint: string;
  amount: string;
}

interface OtherParamPreviewInterface extends ParamPreviewBaseInterface {
  type: ParamPreviewTypeEnum.Other;
  opKind: string;
}

// TODO: replace this type with AssetMetadataInterface
type Asset = 'tez' | Token;

export interface Token {
  contract: string;
  id?: number;
}
