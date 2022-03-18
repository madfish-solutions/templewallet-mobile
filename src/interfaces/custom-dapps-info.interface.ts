export interface CustomDAppInfo {
  name: string;
  dappUrl: string;
  type: string;
  logo: string;
  slug: string;
  category: string[];
}

export interface CustomDAppsInfo {
  dApps: CustomDAppInfo[];
}
