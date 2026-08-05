type ParameterFa12 =
  | {
      entrypoint: 'transfer';
      value: {
        to: string;
        from: string;
        value: string;
      };
    }
  | {
      entrypoint: 'approve';
      value: {
        spender: string;
        value: string;
      };
    };

interface Fa2Transaction {
  to_: string;
  amount: string;
  token_id: string;
}

interface ParameterFa2 {
  entrypoint: string;
  value: unknown[];
}

export interface ParameterFa2Transfer extends ParameterFa2 {
  value: {
    txs: Fa2Transaction[];
    from_: string;
  }[];
}

interface ParameterFa2Approve extends ParameterFa2 {
  value: {
    add_operator: {
      operator: string;
      owner: string;
      token_id: string;
    };
  }[];
}

interface ParameterLiquidityBaking {
  entrypoint: string;
  value: {
    target: string;
    /** Can be 'number' or '-number' */
    quantity: string;
  };
}

interface TzktOperParam {
  entrypoint: string;
  value: unknown;
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isStringProp = (value: Record<string, unknown>, key: string) => typeof value[key] === 'string';

export function isTzktOperParam(param: unknown): param is TzktOperParam {
  if (!isRecord(param)) return false;
  if (typeof param.entrypoint !== 'string') return false;

  return 'value' in param;
}

export function isTzktOperParam_Fa12(param: unknown): param is ParameterFa12 {
  if (!isTzktOperParam(param)) return false;
  if (!isRecord(param.value)) return false;

  if (param.entrypoint === 'approve') {
    return isStringProp(param.value, 'spender') && isStringProp(param.value, 'value');
  }

  return isStringProp(param.value, 'from') && isStringProp(param.value, 'to') && isStringProp(param.value, 'value');
}

function isTzktOperParam_Fa2(param: unknown): param is ParameterFa2 {
  return isTzktOperParam(param) && Array.isArray(param.value);
}

export function isTzktOperParam_Fa2_approve(param: unknown): param is ParameterFa2Approve {
  if (!isTzktOperParam_Fa2(param)) return false;

  const firstValue = param.value.at(0);
  if (!isRecord(firstValue)) return false;

  const addOperator = firstValue.add_operator;
  if (!isRecord(addOperator)) return false;

  return (
    isStringProp(addOperator, 'operator') && isStringProp(addOperator, 'owner') && isStringProp(addOperator, 'token_id')
  );
}

export function isTzktOperParam_Fa2_transfer(param: unknown): param is ParameterFa2Transfer {
  if (!isTzktOperParam_Fa2(param)) return false;

  const firstValue = param.value.at(0);
  if (firstValue == null) return true;
  if (!isRecord(firstValue)) return false;
  if (!isStringProp(firstValue, 'from_')) return false;
  if (!Array.isArray(firstValue.txs)) return false;

  const firstTx = firstValue.txs.at(0);
  if (firstTx == null) return true;
  if (!isRecord(firstTx)) return false;

  return isStringProp(firstTx, 'to_') && isStringProp(firstTx, 'amount') && isStringProp(firstTx, 'token_id');
}

export function isTzktOperParam_LiquidityBaking(param: unknown): param is ParameterLiquidityBaking {
  if (!isTzktOperParam(param)) return false;
  if (!isRecord(param.value)) return false;

  return isStringProp(param.value, 'target') && isStringProp(param.value, 'quantity');
}
