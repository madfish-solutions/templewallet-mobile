import { TransferInterface } from './transfer.interface';

export interface GetAccountTokenTransfersResponseInterface {
  last_id: string;
  total: number;
  transfers: TransferInterface[];
}
