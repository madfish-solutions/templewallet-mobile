export enum OpPreviewType {
  Send,
  Delegate,
  FA1_2Approve,
  ContractCall,
  Other
}

export interface OpPreviewBase {
  type: OpPreviewType;
}

export type OpPreview =
  | SendOpPreview
  | DelegateOpPreview
  | FA1_2ApproveOpPreview
  | ContractCallOpPreview
  | OtherOpPreview;

export interface SendOpPreview extends OpPreviewBase {
  type: OpPreviewType.Send;
  transfers: {
    asset: Asset;
    recipient: string;
    amount: string;
  }[];
}

export interface DelegateOpPreview extends OpPreviewBase {
  type: OpPreviewType.Delegate;
  baker: string;
}

export interface FA1_2ApproveOpPreview extends OpPreviewBase {
  type: OpPreviewType.FA1_2Approve;
  asset: Asset;
  approveTo: string;
  amount: string;
}

export interface ContractCallOpPreview extends OpPreviewBase {
  type: OpPreviewType.ContractCall;
  contract: string;
  entrypoint: string;
}

export interface OtherOpPreview extends OpPreviewBase {
  type: OpPreviewType.Other;
  opKind: string;
}

/**
 * Misc
 */

export type Asset = 'tez' | Token;

export interface FA2Token extends Token {
  id: number;
}

export interface Token {
  contract: string;
  id?: number;
}
