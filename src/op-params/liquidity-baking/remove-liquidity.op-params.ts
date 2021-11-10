export const removeLiquidityOpParams = {
  branch: 'BKs9RMupjo1uMnGagomGsRsjnRRL7wtrwiYY98riqCzyGbDh9de',
  contents: [
    {
      kind: 'transaction',
      source: 'tz1aWpVn8k5aZvVaCKPMdcPeX8ccm5662SLL',
      fee: '2173',
      counter: '18761078',
      gas_limit: '17729',
      storage_limit: '0',
      amount: '0',
      destination: 'KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5',
      parameters: {
        entrypoint: 'removeLiquidity',
        value: {
          prim: 'Pair',
          args: [
            { string: 'tz1aWpVn8k5aZvVaCKPMdcPeX8ccm5662SLL' },
            {
              prim: 'Pair',
              args: [
                { int: '197' },
                {
                  prim: 'Pair',
                  args: [
                    { int: '1998816' },
                    { prim: 'Pair', args: [{ int: '19222' }, { string: '2021-11-09T15:44:59.425Z' }] }
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  ]
};
