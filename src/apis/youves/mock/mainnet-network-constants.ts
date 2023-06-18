import { mainnetDexes, mainnetFarms, mainnetTokens, mainnetUnifiedStakingContractAddress } from './mainnet-networks';
import { NetworkConstants } from './network.base';

export const mainnetNetworkConstants: NetworkConstants = {
  fakeAddress: 'tz1MJx9vhaNRSimcuXPK2rW4fLccQnDAnVKJ',
  natViewerCallback: 'KT1Lj4y492KN1zDyeeKR2HG74SR2j5tcenMV', // 'KT1UAuApZKc1UrbKL27xa5B6XWxUgahLZpnX%set_nat',
  balanceOfViewerCallback: 'KT1CcizgAUXomE1dqvGb3KdEsxFHCWsvuyuz',
  addressViewerCallback: 'KT1UAuApZKc1UrbKL27xa5B6XWxUgahLZpnX%set_address',
  tokens: mainnetTokens,
  farms: mainnetFarms,
  dexes: mainnetDexes,
  unifiedStaking: mainnetUnifiedStakingContractAddress,
  ctezTezDex: 'KT1H5b7LxEExkFd2Tng77TfuWbM5aPvHstPr'
};
