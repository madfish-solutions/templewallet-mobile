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

# Screenshots, the Maestro log, and Maestro's own screen recording land here.
# A host recording fills video.mp4 when this run is not already being recorded.
test_opts=()
video_pid=""
video_file=""
device_video=""
video_stopped=0
if [[ -n "${MAESTRO_ARTIFACTS:-}" ]]; then
  mkdir -p "$MAESTRO_ARTIFACTS"
  test_opts+=(--debug-output "$MAESTRO_ARTIFACTS" --flatten-debug-output)
fi

stop_video() {
  if [[ "$video_stopped" -eq 1 ]]; then
    return 0
  fi
  video_stopped=1
  if [[ -n "$video_pid" ]] && kill -0 "$video_pid" 2>/dev/null; then
    kill -INT "$video_pid" 2>/dev/null || true
    for _ in $(seq 1 40); do
      if ! kill -0 "$video_pid" 2>/dev/null; then
        break
      fi
      sleep 0.25
    done
  fi
  if [[ -n "$video_pid" ]]; then
    wait "$video_pid" 2>/dev/null || true
  fi
  video_pid=""
  if [[ -n "$device_video" ]]; then
    adb pull "$device_video" "$video_file" >/dev/null 2>&1 || true
    adb shell rm -f "$device_video" >/dev/null 2>&1 || true
    device_video=""
  fi
  if [[ -n "$video_file" && -f "$video_file" ]]; then
    echo "Saved $video_file"
  fi
}

start_video() {
  if [[ -z "${MAESTRO_ARTIFACTS:-}" || "${HOST_VIDEO:-1}" == "0" ]]; then
    return 0
  fi
  video_file="$MAESTRO_ARTIFACTS/video.mp4"
  case "$APP_ID" in
    com.madfish.temple-wallet)
      local device="${MAESTRO_DEVICE:-}"
      if [[ -z "$device" ]]; then
        device="$(xcrun simctl list devices booted | sed -n 's/.*(\([0-9A-Fa-f-]\{36\}\)) (Booted).*/\1/p' | head -n 1)"
      fi
      if [[ -z "$device" ]]; then
        echo "No booted simulator, so this run has no screen recording." >&2
        video_file=""
        return 0
      fi
      xcrun simctl io "$device" recordVideo --codec=h264 --force "$video_file" >"$MAESTRO_ARTIFACTS/video.log" 2>&1 &
      video_pid=$!
      ;;
    com.templewallet)
      device_video="/sdcard/temple-perf-video.mp4"
      adb shell rm -f "$device_video" >/dev/null 2>&1 || true
      # screenrecord stops itself after three minutes. The file is still pulled.
      adb shell screenrecord --time-limit 180 "$device_video" >"$MAESTRO_ARTIFACTS/video.log" 2>&1 &
      video_pid=$!
      ;;
  esac
}

trap stop_video EXIT
start_video

maestro_status=0
maestro "${maestro_opts[@]}" test "${test_opts[@]}" "${args[@]}" "$flow" || maestro_status=$?
stop_video
exit "$maestro_status"
