import axios from 'axios';

const tzktApi = axios.create({ baseURL: 'https://api.tzkt.io' });

interface Operation {
  id: number;
  amount: number;
  target: {
    address: string;
  };
}

export const OPERATIONS_LIMIT = 40;

export const loadOperations = (accountPublicKeyHash: string, fromDate: Date, toDate: Date, lastId?: number) =>
  tzktApi
    .get<Operation[]>(`/v1/accounts/${accountPublicKeyHash}/operations`, {
      params: {
        'timestamp.ge': fromDate.toISOString(),
        'timestamp.lt': toDate.toISOString(),
        type: 'transaction',
        limit: OPERATIONS_LIMIT,
        sort: 1,
        quote: 'usd',
        ...(lastId != null ? { lastId } : {})
      }
    })
    .then(response => response.data)
    .catch((error): Operation[] => {
      console.log(error);

      return [];
    });

interface Transfer {
  id: number;
  amount: string;
  to: {
    address: string;
  };
  token: {
    tokenId: string;
    standard: 'fa1.2' | 'fa2';
    contract: {
      address: string;
    };
    metadata: {
      symbol: string;
      decimals: string;
    };
  };
}

export const loadTransfers = (
  accountPublicKeyHash: string,
  fromDate: Date,
  toDate: Date,
  idGreaterThen: number | undefined,
  idLowerThen: number | undefined
) =>
  tzktApi
    .get<Transfer[]>('/v1/tokens/transfers', {
      params: {
        'timestamp.ge': fromDate.toISOString(),
        'timestamp.lt': toDate.toISOString(),
        ...(idGreaterThen != null ? { 'id.gt': idGreaterThen } : {}),
        ...(idLowerThen != null ? { 'id.lt': idLowerThen } : {}),
        'anyof.from.to': accountPublicKeyHash,
        'sort.desc': 'id',
        limit: 10000
      }
    })
    .then(response => response.data)
    .catch((error): Transfer[] => {
      console.log(error);

      return [];
    });
