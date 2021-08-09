#!/bin/sh
gpg --quiet --batch --yes --decrypt --passphrase="$GOOGLE_PLAY_AUTHKEY" --output authkey.json authkey.json.gpg
gpg --quiet --batch --yes --decrypt --passphrase="$KEYSTORE_KEY" --output app/temple-wallet.keystore app/temple-wallet.keystore.gpg
