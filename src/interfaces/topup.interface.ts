export interface TopUpInputInterface {
  name: string;
  code: string;
  network: string;
  networkFullName: string;
  icon: string;
  networkShortName?: string | null;
}

export interface TopUpOutputInterface extends TopUpInputInterface {
  slug: string;
}
