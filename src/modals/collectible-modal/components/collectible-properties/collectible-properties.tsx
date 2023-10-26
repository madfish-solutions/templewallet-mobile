import React, { FC, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { LinkWithIcon } from '../../../../components/link-with-icon/link-with-icon';
import { isDefined } from '../../../../utils/is-defined';

import { useCollectiblePropertiesStyles } from './collectible-properties.styles';
import { CollectibleProperty } from './components/collectible-property/collectible-property';
import { getRoyalties } from './utils/get-royalties.util';
import { getTzktContractLink } from './utils/get-tzkt-contract-link.util';

interface Props {
  editions: number;
  owned: string;
  minted: string;
  royalties: {
    decimals: number;
    amount: number;
  }[];
  contract: string;
  metadata: string;
  tokenId: number;
  style?: StyleProp<ViewStyle>;
}

export const CollectibleProperties: FC<Props> = ({
  contract,
  editions,
  metadata,
  minted,
  owned,
  royalties,
  tokenId,
  style
}) => {
  const styles = useCollectiblePropertiesStyles();

  const date = isDefined(minted) && minted !== '' ? new Date(minted) : undefined;

  const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(
    date
  );

  const hash = isDefined(metadata) && metadata.trim() !== '' ? metadata.split('/')[2] : null;
  const formattedMetadataLink = `https://ipfs.io/ipfs/${hash}`;

  const properties = useMemo(
    () =>
      [
        {
          name: 'Editions',
          value: editions ?? null
        },
        {
          name: 'Owned',
          value: owned ?? null
        },
        {
          name: 'Minted',
          value: formattedDate
        },
        {
          name: 'Royalties',
          value: getRoyalties(royalties)
        },
        {
          name: 'Contract',
          value: <LinkWithIcon text={contract} link={getTzktContractLink(contract)} valueToClipboard={contract} />
        },
        {
          name: 'Metadata',
          value: <LinkWithIcon text="IPFS" link={formattedMetadataLink} />
        },
        {
          name: 'Token ID',
          value: tokenId
        }
      ].filter(({ value }) => isDefined(value)),
    [editions, owned, minted, royalties, contract, metadata, tokenId]
  );

  return (
    <View style={[styles.root, style]}>
      {properties.map(({ name, value }) => (
        <CollectibleProperty key={name} name={name} value={value} />
      ))}
    </View>
  );
};
