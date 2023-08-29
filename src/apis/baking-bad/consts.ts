import type { BakerInterface } from './types';

export const emptyBaker: BakerInterface = {
  address: '',
  name: '',
  logo: '',
  balance: 0,
  stakingBalance: 0,
  stakingCapacity: 0,
  maxStakingBalance: 0,
  freeSpace: 0,
  fee: 0,
  minDelegation: 0,
  payoutDelay: 0,
  payoutPeriod: 0,
  openForDelegation: false,
  imatedRoi: 0,
  serviceType: 'tezos_only',
  serviceHealth: 'dead',
  payoutTiming: 'no_data',
  payoutAccuracy: 'no_data',
  audit: '',
  insuranceCoverage: 0
};

export const mockBaker: BakerInterface = {
  address: 'mockBackerAddress',
  name: 'Mock Backer',
  logo: 'https://mock-backer.logo',
  balance: 444444,
  stakingBalance: 444444,
  stakingCapacity: 444,
  maxStakingBalance: 444,
  freeSpace: 44,
  fee: 4,
  minDelegation: 444,
  payoutDelay: 44,
  payoutPeriod: 44,
  openForDelegation: true,
  imatedRoi: 4,
  serviceType: 'tezos_only',
  serviceHealth: 'active',
  payoutTiming: 'stable',
  payoutAccuracy: 'precise',
  audit: 'Mock Audit',
  insuranceCoverage: 44
};

export interface KnownBaker {
  address: string;
  name: string;
  logo: string | null;
}

export const KNOWN_BAKERS: Array<KnownBaker> = [
  {
    address: 'tz1SvASb4xmkiM82ijexDHzn6bYakaReBypt',
    name: 'Anonstake Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1SvASb4xmkiM82ijexDHzn6bYakaReBypt'
  },
  {
    address: 'tz1TqU5hwh6CtC8Ps5GYBi7YyawvtKLNCbvQ',
    name: 'Ateza Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1TqU5hwh6CtC8Ps5GYBi7YyawvtKLNCbvQ'
  },
  {
    address: 'tz1Zrqm4TkJwqTxm5TiyVFh6taXG4Wrq7tko',
    name: 'Bake’n’Rolls Payouts 2',
    logo: null
  },
  {
    address: 'tz1iVCqjMRG7MfBoFnVjbLQyeLAeJQfLxXze',
    name: 'Bakery-IL Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1iVCqjMRG7MfBoFnVjbLQyeLAeJQfLxXze'
  },
  {
    address: 'tz1NAozDvi5e7frVq9cUaC3uXQQannemB8Jw',
    name: 'BakeTz Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1NAozDvi5e7frVq9cUaC3uXQQannemB8Jw'
  },
  {
    address: 'tz1PayLDWLg39fbkwKejnT3aijz4QEd5kgt3',
    name: 'Baking Team Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1PayLDWLg39fbkwKejnT3aijz4QEd5kgt3'
  },
  {
    address: 'tz1UQvdfQ2cwyDa6k6U62mkHWeULwBqCcJwN',
    name: 'Citadel.one Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1UQvdfQ2cwyDa6k6U62mkHWeULwBqCcJwN'
  },
  {
    address: 'tz1cNARmnRRrvZgspPr2rSTUWq5xtGTuKuHY',
    name: 'Cryptium Labs Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1cNARmnRRrvZgspPr2rSTUWq5xtGTuKuHY'
  },
  {
    address: 'tz1ZbSrRrfhU8LYHELWNswx2JcFARXTGKKVk',
    name: 'DNAG Delegation Payouts 1',
    logo: 'https://services.tzkt.io/v1/avatars/tz1ZbSrRrfhU8LYHELWNswx2JcFARXTGKKVk'
  },
  {
    address: 'tz1aqYbUuXoraB7h39Ls3HvbDwiMhHRV199L',
    name: 'Elite Tezos Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1aqYbUuXoraB7h39Ls3HvbDwiMhHRV199L'
  },
  {
    address: 'tz1W1en9UpMCH4ZJL8wQCh8JDKCZARyVx2co',
    name: 'Everstake Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1W1en9UpMCH4ZJL8wQCh8JDKCZARyVx2co'
  },
  {
    address: 'tz1dXCHSN8uwnappk4uet1WQeuvbaJog4Jwi',
    name: 'Figment Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1dXCHSN8uwnappk4uet1WQeuvbaJog4Jwi'
  },
  {
    address: 'tz1ePtw5wtQMNH1LkJaVXbeVmW7joWqdNzge',
    name: 'GOLD TZ Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1ePtw5wtQMNH1LkJaVXbeVmW7joWqdNzge'
  },
  {
    address: 'tz1TyAEPtLt7oapQvZirVbswz1VRbdRqdfW7',
    name: 'Happy Tezos Dexter Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1TyAEPtLt7oapQvZirVbswz1VRbdRqdfW7'
  },
  {
    address: 'tz1hodLFy8YDHtf1qJ3XH1gCyeXfwWEitkj9',
    name: 'hodl.farm Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1hodLFy8YDHtf1qJ3XH1gCyeXfwWEitkj9'
  },
  {
    address: 'tz1MTAmuFmKu3MoxnkVsMj7xvSScj6d83hu5',
    name: 'LetzBake! Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1MTAmuFmKu3MoxnkVsMj7xvSScj6d83hu5'
  },
  {
    address: 'tz1fRAiiDUxnXZwDmQghh1n6VytQUZWNPwWN',
    name: 'Melange Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1fRAiiDUxnXZwDmQghh1n6VytQUZWNPwWN'
  },
  {
    address: 'tz1MdSsDBG8k8q1pxZrdpSC2Aw49ukFs8ACy',
    name: 'Money Every 3 Days Payouts 1',
    logo: 'https://services.tzkt.io/v1/avatars/tz1MdSsDBG8k8q1pxZrdpSC2Aw49ukFs8ACy'
  },
  {
    address: 'tz1XVBuWfdFpWCiMvsEV8KEX2nkMHN3mfuHJ',
    name: 'Neokta Labs Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1XVBuWfdFpWCiMvsEV8KEX2nkMHN3mfuHJ'
  },
  {
    address: 'tz1c9HEyZdAWXZCLE7h3KcZCyykjZr7VY3QM',
    name: 'PayTezos Payouts 2',
    logo: 'https://services.tzkt.io/v1/avatars/tz1c9HEyZdAWXZCLE7h3KcZCyykjZr7VY3QM'
  },
  {
    address: 'tz1MoonPbyMJSqMVsVwExgVc5egnv18CgSDq',
    name: 'P2P Validator Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1MoonPbyMJSqMVsVwExgVc5egnv18CgSDq'
  },
  {
    address: 'tz1VCP3MQdfxtRc83CRJZX43wc1oZUxb6KmH',
    name: 'Spice Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1VCP3MQdfxtRc83CRJZX43wc1oZUxb6KmH'
  },
  {
    address: 'tz1fishChEERnSesm8mHe7xsJJwymbHVLcYf',
    name: 'Stake.fish Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1fishChEERnSesm8mHe7xsJJwymbHVLcYf'
  },
  {
    address: 'tz1Ywgcavxq9D6hL32Q2AQWHAux9MrWqGoZC',
    name: 'StakeNow Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1Ywgcavxq9D6hL32Q2AQWHAux9MrWqGoZC'
  },
  {
    address: 'tz1Y2rhY9nBKfd2jp7m4z8iAMKKARWS3BvFA',
    name: "Shake 'n Bake Payouts",
    logo: 'https://services.tzkt.io/v1/avatars/tz1Y2rhY9nBKfd2jp7m4z8iAMKKARWS3BvFA'
  },
  {
    address: 'tz1gs78wrxS34XhGPECmN5fABKpEuhUGwAXS',
    name: 'Stakery Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1gs78wrxS34XhGPECmN5fABKpEuhUGwAXS'
  },
  {
    address: 'tz1iuZ76cLaaca8Dh4soYEHjYeVb5vHmmP5Z',
    name: 'Staking Facilities Payouts 2',
    logo: 'https://services.tzkt.io/v1/avatars/tz1iuZ76cLaaca8Dh4soYEHjYeVb5vHmmP5Z'
  },
  {
    address: 'tz1hxtCEcD7idQJEDiJEq37vBkoRcwF6KC2X',
    name: 'Staking Shop Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1hxtCEcD7idQJEDiJEq37vBkoRcwF6KC2X'
  },
  {
    address: 'tz1hTJnYMKSDUv55yREM8ezmC5nsdbPUWao7',
    name: 'Steak.and.Bake Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1hTJnYMKSDUv55yREM8ezmC5nsdbPUWao7'
  },
  {
    address: 'tz1iQRWn2zvdTqhJtGTBbYktodNtw67yE4a6',
    name: 'Tezbaguette Payouts ',
    logo: 'https://services.tzkt.io/v1/avatars/tz1iQRWn2zvdTqhJtGTBbYktodNtw67yE4a6'
  },
  {
    address: 'tz1TkQCxYhhpzMop7Da6g2tpa1Z2giUbPdqv',
    name: 'Tez Baker Payouts 5',
    logo: 'https://services.tzkt.io/v1/avatars/tz1TkQCxYhhpzMop7Da6g2tpa1Z2giUbPdqv'
  },
  {
    address: 'tz1g4o4a2wxpzJ7EgG3onFM5TLaPyiRFjFhL',
    name: 'Tezgate Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1g4o4a2wxpzJ7EgG3onFM5TLaPyiRFjFhL'
  },
  {
    address: 'tz1RiSGsJwcN6roErVt4D3mfSCYSaWYWP9q8',
    name: 'Tezoris Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1RiSGsJwcN6roErVt4D3mfSCYSaWYWP9q8'
  },
  {
    address: 'tz1LJycSuCT25AA5VJwNW1QYXVGyy7YLwZh9',
    name: 'TezosAirGap Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1LJycSuCT25AA5VJwNW1QYXVGyy7YLwZh9'
  },
  {
    address: 'tz1LXaBkg3gZLVyB2awuboPAi6CnWxT4bCMt',
    name: 'Tezos Boutique Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1LXaBkg3gZLVyB2awuboPAi6CnWxT4bCMt'
  },
  {
    address: 'tz1VfoA5qPksECBkvr2EUuT6u5VgLCi3vTPV',
    name: 'Tezos.nu Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1VfoA5qPksECBkvr2EUuT6u5VgLCi3vTPV'
  },
  {
    address: 'tz1Y2bfsQAYHrWZpM1AwomYMw2KEtaJ5VMfU',
    name: 'Tezos.Rio Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1Y2bfsQAYHrWZpM1AwomYMw2KEtaJ5VMfU'
  },
  {
    address: 'tz1LXz7C2wPr74nfMMHmqsqbnasPvi89o2U6',
    name: 'TezosRus Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1LXz7C2wPr74nfMMHmqsqbnasPvi89o2U6'
  },
  {
    address: 'tz1Tnr7CDL5i45EHSPpPReBocDiGbMwpdTCn',
    name: "Tezos Wake n' Bake Payouts",
    logo: 'https://services.tzkt.io/v1/avatars/tz1Tnr7CDL5i45EHSPpPReBocDiGbMwpdTCn'
  },
  {
    address: 'tz1WntXgznbivRjyhE7Y5jEzoebAhMPB2iJa',
    name: 'Tezzieland Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1WntXgznbivRjyhE7Y5jEzoebAhMPB2iJa'
  },
  {
    address: 'tz1ant4etDpDJKQqASYri7bse5tCv2FNbvR6',
    name: 'XTZ Antipodes Payouts 2',
    logo: 'https://services.tzkt.io/v1/avatars/tz1ant4etDpDJKQqASYri7bse5tCv2FNbvR6'
  },
  {
    address: 'tz1Z7HGaayrL4XDNQ7UyXe7L4wXboELkhBm3',
    name: 'XTZ Delegate Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1Z7HGaayrL4XDNQ7UyXe7L4wXboELkhBm3'
  },
  {
    address: 'tz1aF8E89g1EqqzCmbNCLunTtCtxgkoQUX7N',
    name: '0xb1 / PlusMinus Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1aF8E89g1EqqzCmbNCLunTtCtxgkoQUX7N'
  },
  {
    address: 'tz1KwdqMQGB75VDnSsLiteFKVX4HNzvbNvjZ',
    name: '888XTZ Payouts',
    logo: 'https://services.tzkt.io/v1/avatars/tz1KwdqMQGB75VDnSsLiteFKVX4HNzvbNvjZ'
  },
  {
    address: 'tz1ea4wfxxvjpic1DZCU2WnUCBmiPVrSXrSz',
    name: 'Cerberus Bakery Payouts',
    logo: null
  }
];
