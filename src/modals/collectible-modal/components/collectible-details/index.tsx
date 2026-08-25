import React, { FC, isValidElement, memo, ReactElement, useMemo } from 'react';
import { Text, View } from 'react-native';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { LinkWithIcon } from 'src/components/link-with-icon/link-with-icon';
import { NetworkIcon } from 'src/components/network-icon';
import { CollectibleDetailsInterface } from 'src/token/interfaces/collectible-interfaces.interface';
import { isDefined } from 'src/utils/is-defined';

import { useCollectiblePropertiesStyles, useCollectiblePropertyStyles } from './styles';
import { getTzktContractLink } from './utils/get-tzkt-contract-link.util';
import { reduceRoyalties } from './utils/royalties';

interface Props {
  contract: string;
  tokenId: number;
  details: CollectibleDetailsInterface | nullish;
  owned: string;
}

interface EvmProps {
  chainName: string;
  tokenStandard: string;
  contract: string;
  contractLink?: string;
  tokenId: string;
  metadataLink?: string;
  amount: string;
}

export const CollectibleDetails = memo<Props>(({ contract, tokenId, details, owned }) => {
  const styles = useCollectiblePropertiesStyles();

  const { metadata, editions, royalties, timestamp: minted } = details || {};

  const properties = useMemo(() => {
    const date = isDefined(minted) && minted !== '' ? new Date(minted) : undefined;

    const formattedDate = date
      ? new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(date)
      : null;

    const hash = isDefined(metadata) && metadata.trim() !== '' ? metadata.split('/')[2] : null;
    const formattedMetadataLink = `https://ipfs.io/ipfs/${hash}`;

    return [
      {
        name: 'Chain',
        value: <ChainValue name="Tezos" network={CryptoLogoNameEnum.Tezos} />
      },
      {
        name: 'Token standard',
        value: 'FA2'
      },
      {
        name: 'Token ID',
        value: tokenId
      },
      {
        name: 'Token contract',
        value: <LinkWithIcon text={contract} link={getTzktContractLink(contract)} valueToClipboard={contract} />
      },
      {
        name: 'Minted',
        value: formattedDate
      },
      {
        name: 'Royalties',
        value: royalties ? reduceRoyalties(royalties) : null
      },
      {
        name: 'Metadata',
        value: <LinkWithIcon text="IPFS" link={formattedMetadataLink} />
      },
      {
        name: 'Owned',
        value: owned ?? null
      },
      {
        name: 'Editions',
        value: editions ?? null
      }
    ].filter(isDefined);
  }, [editions, owned, minted, royalties, contract, metadata, tokenId]);

  return (
    <View style={styles.root}>
      {properties.map(({ name, value }) => (
        <CollectibleProperty key={name} name={name} value={value} />
      ))}
    </View>
  );
});

export const EvmCollectibleDetails = memo<EvmProps>(
  ({ chainName, tokenStandard, contract, contractLink, tokenId, metadataLink, amount }) => {
    const styles = useCollectiblePropertiesStyles();

    const properties = [
      {
        name: 'Chain',
        value: <ChainValue name={chainName} network={CryptoLogoNameEnum.Etherlink} />
      },
      {
        name: 'Token standard',
        value: tokenStandard
      },
      {
        name: 'Token ID',
        value: tokenId
      },
      {
        name: 'Token contract',
        value: contractLink ? (
          <LinkWithIcon text={contract} link={contractLink} valueToClipboard={contract} />
        ) : (
          contract
        )
      },
      ...(metadataLink
        ? [
            {
              name: 'Metadata',
              value: <LinkWithIcon text="IPFS" link={metadataLink} />
            }
          ]
        : []),
      {
        name: 'Amount',
        value: amount
      }
    ];

    return (
      <View style={styles.root}>
        {properties.map(({ name, value }) => (
          <CollectibleProperty key={name} name={name} value={value} />
        ))}
      </View>
    );
  }
);

interface ChainValueProps {
  name: string;
  network: CryptoLogoNameEnum;
}

const ChainValue = memo<ChainValueProps>(({ name, network }) => {
  const styles = useCollectiblePropertyStyles();

  return (
    <View style={styles.chainValue}>
      <Text style={styles.chainName}>{name}</Text>
      <NetworkIcon name={network} variant="nftBadge" />
    </View>
  );
});

interface CollectiblePropertyProps {
  name: string;
  value: ReactElement | number | string | null;
}

const CollectibleProperty: FC<CollectiblePropertyProps> = ({ name, value }) => {
  const styles = useCollectiblePropertyStyles();

  return (
    <View style={styles.root}>
      <Text style={styles.name}>{name}</Text>
      {/* TODO: Tune type system to forbid falsy nodes */}
      {isValidElement(value) ? value : <Text style={styles.value}>{value}</Text>}
    </View>
  );
};
