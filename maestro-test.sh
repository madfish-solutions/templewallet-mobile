#!/bin/bash

cd "$(dirname "$0")"

# Android package unless the caller set one. The iOS script sets the iOS bundle.
if [[ -z "${APP_ID:-}" ]]; then
  export APP_ID="com.templewallet"
fi

flow="${1:-maestro/import-wallet.yaml}"

args=(
  -e "APP_ID=${APP_ID}"
  -e "HERMES_PROFILE=${HERMES_PROFILE:-0}"
  -e "DEFAULT_HD_ACCOUNT_SEED_PHRASE=acoustic hungry stomach zone hand account track half artist inside exhibit climb"
  -e "DEFAULT_PASSWORD=123456Aa"
)
if [[ -n "${WHALE_NAME:-}" ]]; then
  args+=(-e "WHALE_NAME=${WHALE_NAME}")
fi
if [[ -n "${WHALE_ADDRESS:-}" ]]; then
  args+=(-e "WHALE_ADDRESS=${WHALE_ADDRESS}")
fi

# These flags belong to the top-level maestro command. hierarchy rejects them
# after its subcommand, and an Android emulator is chosen when one is connected.
maestro_opts=()
case "$APP_ID" in
  com.madfish.temple-wallet) maestro_opts+=(--platform ios) ;;
  com.templewallet) maestro_opts+=(--platform android) ;;
esac
if [[ -n "${MAESTRO_DEVICE:-}" ]]; then
  maestro_opts+=(--device "$MAESTRO_DEVICE")
fi

maestro "${maestro_opts[@]}" test "${args[@]}" "$flow"
