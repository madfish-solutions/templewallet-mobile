#!/bin/bash
# Record Temple Wallet with xctrace for one Maestro run, then stop the trace.
#
# Recording every process makes Instruments open a second debug session on the
# simulator. The simulator then relaunches Maestro's XCTest driver
# ("terminate for debugging launch request") and the in-flight tap dies with
# "Transport unreachable". Attach only to the app process Maestro just launched.
# The trace therefore starts once the app is up, and covers the rest of the
# flow. The Simulator window is brought forward, and simctl records its
# framebuffer for the whole run. That recording stays outside the XCTest
# driver. xctrace and simctl have no time limit: SIGINT after Maestro exits
# flushes both files.
#
# Usage:
#   ./xctrace-test.sh
#   XCTRACE_TEMPLATE='Animation Hitches' ./xctrace-test.sh
#   XCTRACE_DEVICE=<simulator-udid> ./xctrace-test.sh
#   XCTRACE_RELAUNCH=0 ./xctrace-test.sh   # the app is already running
#
# APP_ID defaults to the iOS bundle. maestro-test.sh supplies the wallet env.

set -uo pipefail

root="$(cd "$(dirname "$0")" && pwd)"
cd "$root"

template="${XCTRACE_TEMPLATE:-Time Profiler}"
out_dir="${XCTRACE_OUT_DIR:-$root/xctrace-reports}"
device="${XCTRACE_DEVICE:-}"

if [[ -z "${APP_ID:-}" ]]; then
  export APP_ID="com.madfish.temple-wallet"
fi

if [[ -z "$device" ]]; then
  udids=()
  while IFS= read -r udid; do
    [[ -n "$udid" ]] && udids+=("$udid")
  done < <(xcrun simctl list devices booted | sed -n 's/.*(\([0-9A-Fa-f-]\{36\}\)) (Booted).*/\1/p')

  if [[ "${#udids[@]}" -eq 0 ]]; then
    echo "No booted iOS simulator. Boot one, or set XCTRACE_DEVICE." >&2
    exit 1
  fi
  if [[ "${#udids[@]}" -gt 1 ]]; then
    echo "More than one simulator is booted. Set XCTRACE_DEVICE to one of:" >&2
    printf '  %s\n' "${udids[@]}" >&2
    exit 1
  fi
  device="${udids[0]}"
fi

# Simulator apps are host processes. -ww keeps the full path, which contains
# the device id and ends in TempleWallet. A narrow `ps` truncates that away.
list_app_pids() {
  local pid cmd
  while read -r pid cmd; do
    case "$cmd" in
      *"$device"*/TempleWallet) printf '%s\n' "$pid" ;;
    esac
  done < <(ps -axww -o pid=,command=)
}

fresh_app_pid() {
  local pid
  while IFS= read -r pid; do
    [[ -z "$pid" ]] && continue
    case $'\n'"$existing_pids"$'\n' in
      *$'\n'"$pid"$'\n'*) ;;
      *) printf '%s\n' "$pid"; return 0 ;;
    esac
  done < <(list_app_pids)
  return 1
}

mkdir -p "$out_dir"
stamp="$(date +%Y-%m-%d-%H-%M-%S)"
trace="$out_dir/ios-$stamp.trace"
log="$out_dir/ios-$stamp.log"
video="$out_dir/ios-$stamp.mp4"
video_log="$out_dir/ios-$stamp.video.log"

xctrace_pid=""
video_pid=""
maestro_pid=""
xctrace_stopped=0
video_stopped=0

stop_pid() {
  local pid="$1"
  if [[ -z "$pid" ]] || ! kill -0 "$pid" 2>/dev/null; then
    [[ -n "$pid" ]] && wait "$pid" 2>/dev/null || true
    return 0
  fi
  kill -INT "$pid" 2>/dev/null || true
  for _ in $(seq 1 60); do
    if ! kill -0 "$pid" 2>/dev/null; then
      break
    fi
    sleep 0.5
  done
  wait "$pid" 2>/dev/null || true
}

stop_recording() {
  if [[ "$xctrace_stopped" -eq 1 ]]; then
    return 0
  fi
  xctrace_stopped=1
  stop_pid "$xctrace_pid"
}

stop_video() {
  if [[ "$video_stopped" -eq 1 ]]; then
    return 0
  fi
  video_stopped=1
  stop_pid "$video_pid"
}

finish() {
  stop_video
  stop_recording
}

stop_maestro() {
  if [[ -n "$maestro_pid" ]] && kill -0 "$maestro_pid" 2>/dev/null; then
    kill -INT "$maestro_pid" 2>/dev/null || true
    wait "$maestro_pid" 2>/dev/null || true
  fi
}

trap 'stop_maestro; finish; exit 130' INT TERM
trap finish EXIT

open -a Simulator >/dev/null 2>&1 || true

xcrun simctl io "$device" recordVideo --codec=h264 --force "$video" >"$video_log" 2>&1 &
video_pid=$!
video_ready=0
for _ in $(seq 1 40); do
  if grep -q "Recording started" "$video_log" 2>/dev/null; then
    video_ready=1
    break
  fi
  if ! kill -0 "$video_pid" 2>/dev/null; then
    break
  fi
  sleep 0.25
done
if [[ "$video_ready" -eq 1 ]]; then
  echo "Simulator is in front. Video: $video"
else
  echo "Screen recording did not start. The test continues. Log: $video_log" >&2
  cat "$video_log" >&2 || true
fi

existing_pids="$(list_app_pids | sort -u)"

now_ms() {
  perl -MTime::HiRes=time -e 'printf "%d\n", time * 1000'
}

# This script already records the simulator. A second recorder would fail.
maestro_started="$(now_ms)"
if [[ -n "${MAESTRO_FLOW:-}" ]]; then
  HOST_VIDEO=0 bash "$root/maestro-test.sh" "$MAESTRO_FLOW" &
else
  HOST_VIDEO=0 bash "$root/maestro-test.sh" &
fi
maestro_pid=$!

# A relaunch shows up as a new process, and the trace has to follow that one.
# XCTRACE_RELAUNCH=0 means this flow leaves the app running, so attach to it.
app_pid=""
for _ in $(seq 1 140); do
  if ! kill -0 "$maestro_pid" 2>/dev/null; then
    break
  fi
  if app_pid="$(fresh_app_pid)"; then
    break
  fi
  if [[ "${XCTRACE_RELAUNCH:-1}" == "0" ]]; then
    current="$(list_app_pids | head -n 1)"
    if [[ -n "$current" ]]; then
      app_pid="$current"
      break
    fi
  fi
  sleep 0.5
done

if [[ -z "$app_pid" ]]; then
  echo "Temple Wallet did not stay running long enough to attach xctrace." >&2
else
  xcrun xctrace record \
    --template "$template" \
    --device "$device" \
    --attach "$app_pid" \
    --no-prompt \
    --output "$trace" \
    >"$log" 2>&1 &
  xctrace_pid=$!

  ready=0
  for _ in $(seq 1 40); do
    if grep -q "Ctrl-C to stop the recording" "$log" 2>/dev/null; then
      ready=1
      break
    fi
    if ! kill -0 "$xctrace_pid" 2>/dev/null; then
      break
    fi
    sleep 0.5
  done

  if [[ "$ready" -eq 1 ]]; then
    echo "Recording $template for Temple Wallet ($app_pid) on $device"
    echo "Trace: $trace"
  else
    echo "xctrace did not attach to Temple Wallet ($app_pid). The test continues. Log: $log" >&2
    cat "$log" >&2 || true
  fi
fi

maestro_status=0
wait "$maestro_pid" || maestro_status=$?
maestro_pid=""
maestro_ended="$(now_ms)"
if [[ -n "$maestro_started" && -n "$maestro_ended" ]]; then
  echo "MAESTRO_MS $((maestro_ended - maestro_started))"
fi

finish
if [[ -d "$trace" ]]; then
  echo "Saved $trace"
fi
if [[ -f "$video" ]]; then
  echo "Saved $video"
fi
exit "$maestro_status"
