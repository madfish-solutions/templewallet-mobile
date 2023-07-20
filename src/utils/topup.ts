import { TopUpInterfaceBase } from 'src/interfaces/topup.interface';
import { isDefined } from 'src/utils/is-defined';

export const getProperNetworkFullName = ({ name, network }: TopUpInterfaceBase) => {
  if (!isDefined(network)) {
    return null;
  }

  return name === network.fullName ? network.fullName + ' Mainnet' : network.fullName;
};
