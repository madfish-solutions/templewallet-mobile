#!/bin/bash
# Record a Hermes CPU profile of the import flow on an iOS simulator release build.
#
# The native Time Profiler stays in xctrace-test.sh. This script installs a
# release build, lets Maestro start and stop Hermes sampling, then converts the
# profile with react-native-release-profiler. Open the JSON at speedscope.app
# or ui.perfetto.dev.
#
# Usage:
#   ./ios-hermes.sh
#   HERMES_DEVICE=<simulator-udid> ./ios-hermes.sh
#   ./ios-hermes.sh install
#   ./ios-hermes.sh install-cached /path/TempleWallet.app
#
# install stops after the release install and does not pull a Hermes profile.
# install-cached installs a saved simulator app and does not compile.
# BUILD_CACHE, set with install, receives a copy of that app.
#
# The script approves the temple:// scheme for this simulator, then reboots it.
# Otherwise iOS asks "Open in Temple?" and the app does not receive the link.
#
# APP_ID defaults to the iOS bundle. maestro-test.sh supplies the wallet env.

set -uo pipefail

script_root="$(cd "$(dirname "$0")" && pwd)"
if [[ -n "${CHECKOUT:-}" ]]; then
  root="$(cd "$CHECKOUT" && pwd)"
else
  root="$script_root"
fi
cd "$root"

install_only=0
collect_only=0
cached_app=""
if [[ "${1:-}" == "install" ]]; then
  install_only=1
elif [[ "${1:-}" == "collect" ]]; then
  collect_only=1
elif [[ "${1:-}" == "install-cached" ]]; then
  cached_app="${2:-}"
  if [[ ! -d "$cached_app" ]]; then
    echo "Cached app not found: $cached_app" >&2
    exit 1
  fi
fi

device="${HERMES_DEVICE:-}"

if [[ -z "${APP_ID:-}" ]]; then
  export APP_ID="com.madfish.temple-wallet"
fi

if [[ -z "$device" ]]; then
  udids=()
  while IFS= read -r udid; do
    [[ -n "$udid" ]] && udids+=("$udid")
  done < <(xcrun simctl list devices booted | sed -n 's/.*(\([0-9A-Fa-f-]\{36\}\)) (Booted).*/\1/p')

  if [[ "${#udids[@]}" -eq 0 ]]; then
    echo "No booted iOS simulator. Boot one, or set HERMES_DEVICE." >&2
    exit 1
  fi
  if [[ "${#udids[@]}" -gt 1 ]]; then
    echo "More than one simulator is booted. Set HERMES_DEVICE to one of:" >&2
    printf '  %s\n' "${udids[@]}" >&2
    exit 1
  fi
  device="${udids[0]}"
fi

collect_hermes_profile() {
  local container profile="" candidate mtime base args converted waited out
  out="${HERMES_OUT:-$root/hermes-profiles}"
  mkdir -p "$out"
  container="$(xcrun simctl get_app_container "$device" "$APP_ID" data)" || return 1
  # stopProfiling writes the file after Maestro has already opened the stop link.
  for waited in $(seq 1 20); do
    candidate="$(
      find "$container/Library/Caches" -name '*.cpuprofile' -exec stat -f '%m %N' {} \; 2>/dev/null \
        | sort -nr \
        | head -1 \
        | cut -d' ' -f2-
    )"
    if [[ -n "$candidate" && -f "$candidate" ]]; then
      mtime="$(stat -f %m "$candidate")"
      if [[ "$mtime" -ge "$hermes_started" ]]; then
        profile="$candidate"
        break
      fi
    fi
    sleep 0.5
  done
  if [[ -z "$profile" ]]; then
    echo "No Hermes profile in the app cache. The stop link may not have been handled." >&2
    return 1
  fi
  cp "$profile" "$out/profile.cpuprofile"
  args=(--local "$profile")
  if [[ -n "$sourcemap" && -f "$sourcemap" ]]; then
    args+=(--sourcemap-path "$sourcemap")
  else
    echo "No iOS source map. The profile will show bytecode offsets." >&2
  fi
  yarn exec react-native-release-profiler "${args[@]}" || return 1
  base="$(basename "$profile" .cpuprofile)"
  converted="$root/${base}-converted.json"
  if [[ ! -f "$converted" ]]; then
    echo "Profiler did not write $converted" >&2
    return 1
  fi
  if [[ -n "${HERMES_OUT:-}" ]]; then
    mv "$converted" "$out/profile.json"
    echo "Saved $out/profile.json"
  else
    mv "$converted" "$root/hermes-profiles/ios-$stamp-converted.json"
    echo "Saved $root/hermes-profiles/ios-$stamp-converted.json"
  fi
  echo "Open it at https://www.speedscope.app or https://ui.perfetto.dev"
}

if [[ "$collect_only" -eq 1 ]]; then
  hermes_started="${HERMES_STARTED:-0}"
  sourcemap="${HERMES_SOURCEMAP:-}"
  stamp="profile"
  collect_hermes_profile
  exit $?
fi

# simctl openurl, which Maestro uses for openLink, asks "Open in Temple?" until
# this simulator has approved the scheme. The choice lives outside the app, so
# clearState does not remove it. LaunchServices reads the list at boot.
echo "Approving temple:// links on $device"
if ! xcrun simctl spawn "$device" defaults write com.apple.launchservices.schemeapproval \
  "com.apple.CoreSimulator.CoreSimulatorBridge-->temple" -string "$APP_ID"; then
  echo "Could not approve the temple URL scheme." >&2
  exit 1
fi
xcrun simctl shutdown "$device"
xcrun simctl boot "$device"
xcrun simctl bootstatus "$device" -b
open -a Simulator >/dev/null 2>&1 || true

if [[ -n "$cached_app" ]]; then
  echo "Installing the cached release build of $APP_ID on $device"
  xcrun simctl install "$device" "$cached_app" || exit $?
  echo "Installed the release build of $APP_ID"
  # bootstatus returns while the simulator is still finishing startup. The iOS
  # driver died on the first hierarchy when Maestro started in that window.
  echo "Waiting for the simulator to settle"
  sleep 20
  exit 0
fi

mkdir -p "$root/hermes-profiles"
stamp="$(date +%Y-%m-%d-%H-%M-%S)"
sourcemap="${SOURCEMAP_FILE:-$root/hermes-profiles/ios-$stamp.jsbundle.map}"
mkdir -p "$(dirname "$sourcemap")"

echo "Installing the release build of $APP_ID on $device"
export SENTRY_DISABLE_AUTO_UPLOAD=true
export SOURCEMAP_FILE="$sourcemap"
install_status=0
yarn react-native run-ios --mode Release --udid "$device" --no-packager || install_status=$?
if [[ "$install_status" -ne 0 ]]; then
  exit "$install_status"
fi

if [[ -n "${BUILD_CACHE:-}" ]]; then
  built_app="$(xcrun simctl get_app_container "$device" "$APP_ID" app)" || built_app=""
  if [[ -n "$built_app" && -d "$built_app" ]]; then
    mkdir -p "$BUILD_CACHE"
    rm -rf "$BUILD_CACHE/TempleWallet.app"
    ditto "$built_app" "$BUILD_CACHE/TempleWallet.app"
    echo "Cached the release build at $BUILD_CACHE/TempleWallet.app"
  else
    echo "The installed app was not found, so it was not cached." >&2
  fi
fi

if [[ -n "${BUILD_CACHE:-}" && -f "$sourcemap" ]]; then
  mkdir -p "$BUILD_CACHE"
  cp "$sourcemap" "$BUILD_CACHE/bundle.map"
fi

if [[ "$install_only" -eq 1 ]]; then
  echo "Installed the release build of $APP_ID"
  exit 0
fi

hermes_started="$(date +%s)"
maestro_status=0
HERMES_PROFILE=1 bash "$root/maestro-test.sh" || maestro_status=$?

pull_status=0
collect_hermes_profile || pull_status=$?
if [[ "$maestro_status" -ne 0 ]]; then
  exit "$maestro_status"
fi
exit "$pull_status"
