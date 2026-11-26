#!/bin/bash
# Measure the import flow on a release build with one profiler.
#
# Flashlight and Perfetto both take the kernel trace buffer, so a run uses one
# of them. Flashlight records the score. Perfetto records scheduler and frame
# events around the same Maestro flow. Reading the trace: docs/developer/perfetto.md.
# Hermes records JavaScript function samples and does not use that buffer.
#
# Release signing reads MYAPP_UPLOAD_STORE_PASSWORD and MYAPP_UPLOAD_KEY_PASSWORD
# from android/gradle.properties. Pass them in the environment. The script writes
# them only for the install, then removes them again on success, failure, or interrupt.
#
# Usage:
#   MYAPP_UPLOAD_STORE_PASSWORD=... MYAPP_UPLOAD_KEY_PASSWORD=... yarn android:flashlight
#   MYAPP_UPLOAD_STORE_PASSWORD=... MYAPP_UPLOAD_KEY_PASSWORD=... yarn android:perfetto
#   MYAPP_UPLOAD_STORE_PASSWORD=... MYAPP_UPLOAD_KEY_PASSWORD=... yarn android:hermes
#   MYAPP_UPLOAD_STORE_PASSWORD=... MYAPP_UPLOAD_KEY_PASSWORD=... bash android-test.sh install
#   bash android-test.sh install-cached /path/app-release.apk
#
# install stops after the release install. install-cached installs a saved APK
# and does not sign or compile. SKIP_INSTALL=1 skips signing and Gradle and
# traces the app that is already installed. MAESTRO_FLOW replaces the import
# flow for that trace. BUILD_CACHE, set with install, receives a copy of the APK.

set -uo pipefail

script_root="$(cd "$(dirname "$0")" && pwd)"
if [[ -n "${CHECKOUT:-}" ]]; then
  root="$(cd "$CHECKOUT" && pwd)"
else
  root="$script_root"
fi
cd "$root"

mode="${1:-}"
cached_apk="${2:-}"
case "$mode" in
  flashlight|perfetto|hermes|install|collect) ;;
  install-cached)
    if [[ ! -f "$cached_apk" ]]; then
      echo "Cached APK not found: $cached_apk" >&2
      exit 1
    fi
    ;;
  *)
    echo "Usage: yarn android:flashlight, yarn android:perfetto, yarn android:hermes, or bash android-test.sh install|collect" >&2
    exit 1
    ;;
esac

export APP_ID="${APP_ID:-com.templewallet}"
props="$root/android/gradle.properties"
config="$script_root/perfetto.cfg"

perfetto_session=""
perfetto_stopped=0
passwords_cleared=0
if [[ "$mode" == "install-cached" || "$mode" == "collect" || "${SKIP_INSTALL:-}" == "1" ]]; then
  passwords_cleared=1
fi
device_trace=""
local_trace=""
hermes_started=0

if [[ "$mode" != "install-cached" && "$mode" != "collect" && "${SKIP_INSTALL:-}" != "1" ]]; then
  if [[ -z "${MYAPP_UPLOAD_STORE_PASSWORD:-}" || -z "${MYAPP_UPLOAD_KEY_PASSWORD:-}" ]]; then
    echo "Set MYAPP_UPLOAD_STORE_PASSWORD and MYAPP_UPLOAD_KEY_PASSWORD." >&2
    exit 1
  fi
fi

if [[ "$mode" == "perfetto" && ! -f "$config" ]]; then
  echo "Perfetto config not found: $config" >&2
  exit 1
fi

# Gradle properties treat "\" as an escape, and sed treats "\", "&", and the
# "|" delimiter specially. Escape for both before the value is written.
escape_password() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//\\/\\\\}"
  value="${value//&/\\&}"
  value="${value//|/\\|}"
  printf '%s' "$value"
}

rewrite_passwords() {
  local mode="$1"
  local store_value="" key_value=""
  if [[ "$mode" == "set" ]]; then
    store_value="${MYAPP_UPLOAD_STORE_PASSWORD}"
    key_value="${MYAPP_UPLOAD_KEY_PASSWORD}"
    if [[ "$store_value" == *$'\n'* || "$store_value" == *$'\r'* || "$key_value" == *$'\n'* || "$key_value" == *$'\r'* ]]; then
      echo "Keystore passwords must be a single line." >&2
      return 1
    fi
  elif [[ "$mode" != "clear" ]]; then
    echo "Unknown password mode: $mode" >&2
    return 1
  fi

  local key
  for key in MYAPP_UPLOAD_STORE_PASSWORD MYAPP_UPLOAD_KEY_PASSWORD; do
    if ! grep -Eq "^[[:space:]]*${key}=" "$props"; then
      echo "gradle.properties is missing ${key}" >&2
      return 1
    fi
  done

  local store_escaped key_escaped sed_script tmp perm
  store_escaped="$(escape_password "$store_value")"
  key_escaped="$(escape_password "$key_value")"
  sed_script="$(mktemp)"
  tmp="$(mktemp)"
  {
    printf '%s' 's|^[[:space:]]*MYAPP_UPLOAD_STORE_PASSWORD=.*|MYAPP_UPLOAD_STORE_PASSWORD='
    printf '%s' "$store_escaped"
    printf '%s\n' '|'
    printf '%s' 's|^[[:space:]]*MYAPP_UPLOAD_KEY_PASSWORD=.*|MYAPP_UPLOAD_KEY_PASSWORD='
    printf '%s' "$key_escaped"
    printf '%s\n' '|'
  } >"$sed_script"
  if ! sed -f "$sed_script" "$props" >"$tmp"; then
    rm -f "$sed_script" "$tmp"
    return 1
  fi
  rm -f "$sed_script"
  perm="$(stat -f '%OLp' "$props" 2>/dev/null || stat -c '%a' "$props")"
  mv "$tmp" "$props"
  chmod "$perm" "$props"
}

clear_passwords() {
  if [[ "$passwords_cleared" -eq 1 ]]; then
    return 0
  fi
  if rewrite_passwords clear; then
    passwords_cleared=1
  else
    echo "Could not clear the keystore passwords in $props" >&2
  fi
  unset MYAPP_UPLOAD_STORE_PASSWORD MYAPP_UPLOAD_KEY_PASSWORD
}

# Flashlight's atrace leaves /sys/kernel/tracing/tracing_on set. Perfetto then
# refuses the ftrace source ("ftrace in use by non-Perfetto") and the file only
# contains the process list from startup.
release_stuck_ftrace() {
  local node state
  adb shell atrace --async_stop >/dev/null 2>&1 || true
  for node in /sys/kernel/tracing/tracing_on /sys/kernel/debug/tracing/tracing_on; do
    state="$(adb shell "cat '$node' 2>/dev/null" | tr -d '\r' || true)"
    if [[ "$state" == "1" ]]; then
      echo "Kernel ftrace was left on. Releasing it so Perfetto can record events."
      if ! adb shell "echo 0 > '$node'"; then
        echo "Could not turn kernel ftrace off." >&2
        return 1
      fi
    fi
  done
}

stop_perfetto() {
  if [[ "$perfetto_stopped" -eq 1 ]]; then
    return 0
  fi
  perfetto_stopped=1
  if [[ -z "$perfetto_session" ]]; then
    return 0
  fi
  # --stop blocks until traced has flushed the file.
  adb shell perfetto --attach="$perfetto_session" --stop >/dev/null 2>&1 || true
  perfetto_session=""
  mkdir -p "$(dirname "$local_trace")"
  if adb pull "$device_trace" "$local_trace"; then
    echo "Saved $local_trace"
  else
    echo "Could not pull the Perfetto trace from $device_trace" >&2
  fi
  adb shell rm -f "$device_trace" >/dev/null 2>&1 || true
}

# Release builds are not debuggable, so run-as cannot read the app cache.
# stopProfiling(true) copies the profile into public Downloads. API 29+ uses
# MediaStore and needs no storage permission. API 24–28 needs the permission
# this flow denies. MediaStore is given MIME type text/plain, so Android stores
# the file as "<name>.cpuprofile.txt".
collect_hermes_profile() {
  local file="" map args converted mtime waited out
  # stopProfiling writes the file after Maestro has already opened the stop link.
  for waited in $(seq 1 20); do
    file="$(adb shell ls -tp /sdcard/Download | tr -d '\r' | grep -E '\.cpuprofile(\.txt)?$' | head -1 || true)"
    if [[ -n "$file" ]]; then
      mtime="$(adb shell stat -c %Y "/sdcard/Download/$file" 2>/dev/null | tr -d '\r' || true)"
      if [[ -z "$mtime" || "$mtime" -ge $((hermes_started - 5)) ]]; then
        break
      fi
    fi
    file=""
    sleep 0.5
  done
  if [[ -z "$file" ]]; then
    echo "No Hermes profile in Downloads. The stop link may not have been handled." >&2
    return 1
  fi
  map="${HERMES_SOURCEMAP:-$root/android/app/build/generated/sourcemaps/react/release/index.android.bundle.map}"
  out="${HERMES_OUT:-$root/hermes-profiles}"
  mkdir -p "$out"
  args=(--fromDownload --filename "$file" --appId "$APP_ID")
  if [[ -f "$map" ]]; then
    args+=(--sourcemap-path "$map")
  else
    echo "No Android source map at $map. The profile will show bytecode offsets." >&2
  fi
  yarn exec react-native-release-profiler "${args[@]}" || return 1
  converted="$root/${file%.cpuprofile}-converted.json"
  if [[ ! -f "$converted" ]]; then
    echo "Profiler did not write $converted" >&2
    return 1
  fi
  adb pull "/sdcard/Download/$file" "$out/profile.cpuprofile" >/dev/null 2>&1 || true
  adb shell rm -f "/sdcard/Download/$file" >/dev/null 2>&1 || true
  if [[ -n "${HERMES_OUT:-}" ]]; then
    mv "$converted" "$out/profile.json"
    echo "Saved $out/profile.json"
  else
    mv "$converted" "$root/hermes-profiles/android-$stamp-converted.json"
    echo "Saved $root/hermes-profiles/android-$stamp-converted.json"
  fi
  echo "Open it at https://www.speedscope.app or https://ui.perfetto.dev"
}

finish() {
  stop_perfetto
  clear_passwords
}

trap 'finish; exit 130' INT TERM
trap finish EXIT

if [[ -z "${ANDROID_SERIAL:-}" ]]; then
  serials=()
  while read -r serial state; do
    [[ "$state" == "device" ]] && serials+=("$serial")
  done < <(adb devices | tail -n +2)

  if [[ "${#serials[@]}" -eq 0 ]]; then
    echo "No Android device is connected. Start an emulator, or set ANDROID_SERIAL." >&2
    exit 1
  fi
  if [[ "${#serials[@]}" -gt 1 ]]; then
    echo "More than one Android device is connected. Set ANDROID_SERIAL to one of:" >&2
    printf '  %s\n' "${serials[@]}" >&2
    exit 1
  fi
fi

if [[ "$mode" == "collect" ]]; then
  hermes_started="${HERMES_STARTED:-0}"
  stamp="profile"
  collect_hermes_profile
  exit $?
fi

if [[ "$mode" == "perfetto" ]]; then
  if ! adb shell ls /system/bin/perfetto >/dev/null 2>&1; then
    echo "This device has no Perfetto binary. Use Android 9 or newer." >&2
    exit 1
  fi
  sdk="$(adb shell getprop ro.build.version.sdk | tr -d '\r')"
  if [[ "$sdk" -lt 30 ]]; then
    adb shell setprop persist.traced.enable 1
  fi
fi

install_release_apk() {
  local apk="$1"
  if adb shell pm path "$APP_ID" 2>/dev/null | grep -q .; then
    if adb shell dumpsys package "$APP_ID" | grep -q DEBUGGABLE; then
      echo "Replacing the debug build of $APP_ID with release"
      adb uninstall "$APP_ID" >/dev/null
    fi
  fi
  if ! adb install -r "$apk"; then
    adb uninstall "$APP_ID" >/dev/null || true
    adb install "$apk"
  fi
}

if [[ "$mode" == "install-cached" ]]; then
  echo "Installing the cached release build of $APP_ID"
  install_release_apk "$cached_apk" || exit $?
  echo "Installed the release build of $APP_ID"
  exit 0
fi

if [[ "${SKIP_INSTALL:-}" != "1" ]]; then
  if adb shell pm path "$APP_ID" 2>/dev/null | grep -q .; then
    if adb shell dumpsys package "$APP_ID" | grep -q DEBUGGABLE; then
      echo "Replacing the debug build of $APP_ID with release"
      adb uninstall "$APP_ID" >/dev/null
    fi
  fi

  echo "Installing the release build of $APP_ID"
  rewrite_passwords set
  install_status=0
  (
    cd "$root/android"
    SENTRY_DISABLE_AUTO_UPLOAD=true ./gradlew :app:installRelease --no-daemon
  ) || install_status=$?
  clear_passwords
  if [[ "$install_status" -ne 0 ]]; then
    exit "$install_status"
  fi
  if [[ -n "${BUILD_CACHE:-}" ]]; then
    apk="$root/android/app/build/outputs/apk/release/app-release.apk"
    if [[ ! -f "$apk" ]]; then
      apk="$(find "$root/android/app/build/outputs/apk/release" -name '*.apk' -type f -print -quit)"
    fi
    if [[ -n "$apk" && -f "$apk" ]]; then
      mkdir -p "$BUILD_CACHE"
      cp "$apk" "$BUILD_CACHE/app-release.apk"
      echo "Cached the release build at $BUILD_CACHE/app-release.apk"
    else
      echo "The release APK was not found, so it was not cached." >&2
    fi
  fi
  map="$root/android/app/build/generated/sourcemaps/react/release/index.android.bundle.map"
  if [[ -f "$map" ]]; then
    if [[ -n "${HERMES_SOURCEMAP:-}" ]]; then
      mkdir -p "$(dirname "$HERMES_SOURCEMAP")"
      cp "$map" "$HERMES_SOURCEMAP"
      echo "Saved $HERMES_SOURCEMAP"
    fi
    if [[ -n "${BUILD_CACHE:-}" ]]; then
      mkdir -p "$BUILD_CACHE"
      cp "$map" "$BUILD_CACHE/bundle.map"
    fi
  fi
fi

if [[ "$mode" == "install" ]]; then
  echo "Installed the release build of $APP_ID"
  exit 0
fi

if [[ "${SKIP_INSTALL:-}" == "1" ]]; then
  unset MYAPP_UPLOAD_STORE_PASSWORD MYAPP_UPLOAD_KEY_PASSWORD
fi

stamp="$(date +%Y-%m-%d-%H-%M-%S)"

case "$mode" in
  flashlight)
    mkdir -p "$root/flashlight-reports"
    flashlight_status=0
    flashlight test \
      --bundleId "$APP_ID" \
      --testCommand "$root/maestro-test.sh" \
      --iterationCount 1 \
      --resultsFilePath "$root/flashlight-reports/android-$stamp.json" \
      || flashlight_status=$?
    exit "$flashlight_status"
    ;;
  perfetto)
    if [[ -n "${PERFETTO_OUT:-}" ]]; then
      mkdir -p "$PERFETTO_OUT"
    else
      mkdir -p "$root/perfetto-reports"
    fi
    device_trace="/data/misc/perfetto-traces/android-$stamp.perfetto-trace"
    local_trace="${PERFETTO_OUT:-$root/perfetto-reports}/android-$stamp.perfetto-trace"
    pushed_config="/data/local/tmp/perfetto-$stamp.cfg"
    tmp_config="$(mktemp)"

    sed "s/atrace_apps: \"com.templewallet\"/atrace_apps: \"$APP_ID\"/" "$config" >"$tmp_config"
    if ! adb push "$tmp_config" "$pushed_config" >/dev/null; then
      rm -f "$tmp_config"
      echo "Could not push the Perfetto config." >&2
      exit 1
    fi
    rm -f "$tmp_config"
    release_stuck_ftrace || exit 1
    perfetto_session="temple-$stamp"
    # The "Connected" line is written to stderr. Keep it with the exit status.
    perfetto_output="$(adb shell "cat '$pushed_config' | perfetto --txt -c - --detach='$perfetto_session' -o '$device_trace'" 2>&1)" || true
    adb shell rm -f "$pushed_config" >/dev/null 2>&1 || true
    sleep 1
    if [[ "$(adb shell cat /sys/kernel/tracing/tracing_on 2>/dev/null | tr -d '\r')" != "1" ]]; then
      echo "Perfetto did not start." >&2
      printf '%s\n' "$perfetto_output" >&2
      perfetto_session=""
      # A comparison still runs the flow. The standalone command exists to record.
      if [[ -z "${MAESTRO_FLOW:-}" ]]; then
        exit 1
      fi
      echo "The flow continues without a trace." >&2
    else
      echo "Perfetto is tracing $APP_ID"
    fi
    now_ms() {
      perl -MTime::HiRes=time -e 'printf "%d\n", time * 1000'
    }
    maestro_started="$(now_ms)"
    maestro_status=0
    if [[ -n "${MAESTRO_FLOW:-}" ]]; then
      bash "$root/maestro-test.sh" "$MAESTRO_FLOW" || maestro_status=$?
    else
      bash "$root/maestro-test.sh" || maestro_status=$?
    fi
    maestro_ended="$(now_ms)"
    echo "MAESTRO_MS $((maestro_ended - maestro_started))"
    exit "$maestro_status"
    ;;
  hermes)
    mkdir -p "$root/hermes-profiles"
    hermes_started="$(date +%s)"
    maestro_status=0
    HERMES_PROFILE=1 bash "$root/maestro-test.sh" || maestro_status=$?
    pull_status=0
    collect_hermes_profile || pull_status=$?
    if [[ "$maestro_status" -ne 0 ]]; then
      exit "$maestro_status"
    fi
    exit "$pull_status"
    ;;
esac
