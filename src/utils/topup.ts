import { TopUpInterfaceBase } from 'src/interfaces/topup.interface';
import { isDefined } from 'src/utils/is-defined';

export const getProperNetworkFullName = (item: TopUpInterfaceBase) =>
  isDefined(item.network)
    ? item.name === item.network.fullName
      ? item.network.fullName + ' Mainnet'
      : item.network.fullName
    : null;
