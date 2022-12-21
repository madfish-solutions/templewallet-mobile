import { BigNumber } from 'bignumber.js';

import { createCsvFile } from './utils/file.utils';
import { mutezToTz } from './utils/number.utils';
import { getArgValue } from './utils/script.utils';
import { loadExchangeRates } from './utils/temple-wallet-api.utils';
import { loadOperations, loadTransfers, OPERATIONS_LIMIT } from './utils/tzkt.utils';

enum RouterType {
  Mobile = 'Mobile',
  Extension = 'Extension'
}

const RouterFeeAddressRecord: Record<RouterType, string> = {
  [RouterType.Mobile]: 'tz1XYSt74vwVWgixEXdiS4C5t3UvuExRRTZR',
  [RouterType.Extension]: 'tz1UbRzhYjQKTtWYvGUWcRtVT4fN3NESDVYT'
};

interface ResultItem {
  symbol: string;
  decimals: number;
  receiveMutezAmount: BigNumber;
}

const app = async () => {
  let result: Record<string, ResultItem> = {};

  const routerType = getArgValue('--type') as RouterType;
  const fromDate = new Date(getArgValue('--from'));
  const toDate = new Date(getArgValue('--to'));

  const routerFeeAddress = RouterFeeAddressRecord[routerType];

  let isAllDataFetched = false;
  let lastOperationId: number | undefined;

  do {
    // Load data
    const operations = await loadOperations(routerFeeAddress, fromDate, toDate, lastOperationId);

    isAllDataFetched = operations.length < OPERATIONS_LIMIT;
    const idGreaterThen = isAllDataFetched ? undefined : lastOperationId;

    lastOperationId = operations[operations.length - 1].id;

    const transfers = await loadTransfers(routerFeeAddress, fromDate, toDate, idGreaterThen, lastOperationId);

    // Calculate total sum
    operations.forEach(operation => {
      if (operation.target.address === routerFeeAddress) {
        const slug = 'tez';
        const resultItem = result[slug] ?? {
          symbol: 'TEZ',
          decimals: 6,
          receiveMutezAmount: new BigNumber(0)
        };

        result = {
          ...result,
          [slug]: {
            ...resultItem,
            receiveMutezAmount: resultItem?.receiveMutezAmount.plus(operation.amount)
          }
        };
      }
    });

    transfers.forEach(transfer => {
      if (transfer.to.address === routerFeeAddress) {
        const slug = transfer.token.contract.address + '_' + transfer.token.tokenId;
        const resultItem = result[slug] ?? {
          symbol: transfer.token.metadata.symbol,
          decimals: transfer.token.metadata.decimals,
          receiveMutezAmount: new BigNumber(0)
        };

        result = {
          ...result,
          [slug]: {
            ...resultItem,
            receiveMutezAmount: resultItem?.receiveMutezAmount.plus(transfer.amount)
          }
        };
      }
    });
  } while (!isAllDataFetched);

  const exchangeRates = await loadExchangeRates();

  let csvData = '';

  for (const slug in result) {
    const item = result[slug];

    const symbol = item.symbol;
    const receivedAmount = mutezToTz(item.receiveMutezAmount, item.decimals);

    const exchangeRate = exchangeRates[slug] ?? 0;
    const dollarValue = receivedAmount.multipliedBy(exchangeRate);

    csvData += `${symbol},${receivedAmount.toFixed()},${exchangeRate},${dollarValue.toFixed()}\n`;
  }

  createCsvFile(csvData);
};

app();
