import { TopUpInterfaceBase } from 'src/interfaces/topup.interface';

export type TopUpInputInterface = TopUpInterfaceBase;

export interface TopUpOutputInterface extends TopUpInterfaceBase {
  slug: string;
}
