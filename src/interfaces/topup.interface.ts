interface TopUpItemNetwork {
  code: string;
  fullName: string;
  shortName?: string;
}

export interface TopUpInterfaceBase {
  name: string;
  code: string;
  codeToDisplay?: string;
  network?: TopUpItemNetwork;
  icon: string;
  minAmount?: number;
  maxAmount?: number;
  precision?: number;
}

export interface TopUpWithNetworkInterface extends TopUpInterfaceBase {
  network: TopUpItemNetwork;
}
