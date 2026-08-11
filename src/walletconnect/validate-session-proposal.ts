import { WalletKitTypes } from '@reown/walletkit';
import { ProposalTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { uniq } from 'lodash-es';

import { toEvmCaipChainId } from 'src/utils/evm/caip.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { isSupportedWcMethod } from './constants';

export const ETHERLINK_CAIP_CHAIN_ID = toEvmCaipChainId(ETHERLINK_MAINNET_CHAIN_ID);

export const SUPPORTED_WC_CHAINS = [ETHERLINK_CAIP_CHAIN_ID];

/** CAIP-10 chain-agnostic EOA id — dApps use this to accept any EVM chain the wallet offers. */
export const EIP155_CHAIN_AGNOSTIC_ID = 'eip155:0';

const isEip155NamespaceKey = (namespaceKey: string) => namespaceKey === 'eip155' || namespaceKey.startsWith('eip155:');

export const isEip155ChainAgnostic = (caipChainId: string) => caipChainId === EIP155_CHAIN_AGNOSTIC_ID;

const getRequiredChains = (namespaceKey: string, namespace: ProposalTypes.RequiredNamespace) => {
  if (namespace.chains && namespace.chains.length > 0) {
    return namespace.chains;
  }

  return namespaceKey.includes(':') ? [namespaceKey] : [];
};

const resolveConcreteWcChains = (chains: string[]) => {
  const concreteChains = chains.filter(chain => !isEip155ChainAgnostic(chain));

  if (concreteChains.length === 0 && chains.some(isEip155ChainAgnostic)) {
    return SUPPORTED_WC_CHAINS;
  }

  return concreteChains;
};

const normalizeNamespaceChains = (namespace: ProposalTypes.RequiredNamespace): ProposalTypes.RequiredNamespace => {
  if (!namespace.chains || namespace.chains.length === 0 || !namespace.chains.some(isEip155ChainAgnostic)) {
    return namespace;
  }

  return {
    ...namespace,
    chains: resolveConcreteWcChains(namespace.chains)
  };
};

const normalizeProposalNamespaces = (
  namespaces: ProposalTypes.RequiredNamespaces
): ProposalTypes.RequiredNamespaces => {
  const normalized: ProposalTypes.RequiredNamespaces = {};

  for (const [namespaceKey, namespace] of Object.entries(namespaces)) {
    if (isEip155ChainAgnostic(namespaceKey)) {
      const existing = normalized.eip155;
      const remapped = normalizeNamespaceChains({
        ...namespace,
        chains: resolveConcreteWcChains(namespace.chains ?? [namespaceKey])
      });

      normalized.eip155 = existing
        ? {
            ...existing,
            chains: uniq((existing.chains ?? []).concat(remapped.chains ?? [])),
            methods: uniq(existing.methods.concat(remapped.methods)),
            events: uniq(existing.events.concat(remapped.events))
          }
        : remapped;

      continue;
    }

    normalized[namespaceKey] = normalizeNamespaceChains(namespace);
  }

  return normalized;
};

/**
 * Replaces chain-agnostic `eip155:0` requests with our concrete supported chains so
 * `buildApprovedNamespaces` can approve a real session instead of an empty/non-conforming one.
 */
export const normalizeSessionProposalParams = (params: ProposalTypes.Struct): ProposalTypes.Struct => ({
  ...params,
  requiredNamespaces: normalizeProposalNamespaces(params.requiredNamespaces),
  optionalNamespaces: normalizeProposalNamespaces(params.optionalNamespaces ?? {})
});

export const getSessionProposalRejectReason = (proposal: WalletKitTypes.SessionProposal) => {
  const { requiredNamespaces } = proposal.params;

  for (const [namespaceKey, namespace] of Object.entries(requiredNamespaces)) {
    if (!isEip155NamespaceKey(namespaceKey)) {
      return getSdkError('UNSUPPORTED_NAMESPACE_KEY');
    }

    const requiredChains = resolveConcreteWcChains(getRequiredChains(namespaceKey, namespace));

    if (requiredChains.some(chain => !SUPPORTED_WC_CHAINS.includes(chain))) {
      return getSdkError('UNSUPPORTED_CHAINS');
    }

    if (namespace.methods.some(method => !isSupportedWcMethod(method))) {
      return getSdkError('UNSUPPORTED_METHODS');
    }
  }

  return undefined;
};
