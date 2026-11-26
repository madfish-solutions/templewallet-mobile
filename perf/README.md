# Performance comparison

Compare two git versions of the release app on the same watch-only wallet. The phone is the machine: this does not throttle CPU.

## Tools

Install [Maestro](https://docs.maestro.dev/get-started/quickstart). It drives the app during a comparison.

Install [Flashlight](https://docs.flashlight.dev/test/) when you want an Android score. It stays a separate command and cannot run beside Perfetto.

Use an Android emulator with 4 GB of RAM and 2 cores. iOS uses a booted simulator.

### mitmproxy

The comparison replays wallet API answers from a cache. Install the binaries from the [mitmproxy installation guide](https://docs.mitmproxy.org/stable/overview/installation/), then start `mitmproxy` once. The first launch creates the certificate in `~/.mitmproxy/` and shows whether the proxy is listening on port 8080. Leave it running while you finish the steps for the platform you will measure. Quit it before a comparison: the measured run uses `mitmdump` instead, as shown below.

**iOS simulator.** The simulator uses the Mac network, so the certificate has to be trusted there and the Mac has to send traffic through the proxy.

1. Boot the simulator. `xcrun simctl list` prints the booted simulators. Copy the GUID of the one you will use.
2. Install the certificate into that simulator:

   ```bash
   xcrun simctl keychain <simulator-guid> add-cert ~/.mitmproxy/mitmproxy-ca-cert.pem
   ```

3. Trust the same certificate in the Mac system keychain:

   ```bash
   sudo security add-trusted-cert -d -p ssl -p basic -k /Library/Keychains/System.keychain ~/.mitmproxy/mitmproxy-ca-cert.pem
   ```

4. Open the Mac network settings for the connection you use and set its proxy to `localhost`, port `8080`.

   ![Web proxy and secure web proxy set to 127.0.0.1 port 8080](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*eN-SHr-8wXXqqz1TQ4gSxA.png)

5. On the simulator, open Safari at `http://mitm.it` and follow the iOS instructions.

Turn the Mac proxy off when you are finished. While it is on, traffic from this computer goes through mitmproxy as well.

**Android emulator.** The emulator has its own network settings. Start the emulator you will use for the tests, open its current network details, and edit that connection. Set a manual proxy to the computer's address on the local network and port `8080`. Save, open Chrome in the emulator at `http://mitm.it`, and follow the Android instructions.

**Check.** From the simulator or emulator, open any page. The running `mitmproxy` window should list that request.

## Run

```bash
# Point mitmproxy at the cache, with the warm-up fill on, and leave it running.
TW_API_CACHE=api-cache TW_API_CACHE_FILL=1 mitmdump -s api-cache.py

# Android needs the keystore passwords in the environment. They are written
# only for the Gradle install and cleared again when that step ends.
export TW_API_CACHE=api-cache
export MYAPP_UPLOAD_STORE_PASSWORD=...
export MYAPP_UPLOAD_KEY_PASSWORD=...

# Replace TW-2411-only-add-tests-selectors with $(git merge-base HEAD development) when all necessary selectors appear there
yarn perf --platform android base=TW-2411-only-add-tests-selectors mine=.
yarn perf --platform ios --profile etherlink base=TW-2411-only-add-tests-selectors mine=.
```

An iOS comparison uses the one booted simulator, or `HERMES_DEVICE` when that is set, and passes that id to Maestro with `--platform ios`. The install and every flow, including the Settings hold, use that simulator. A cached iOS install reboots that simulator, then waits 20 seconds before Maestro starts.

`--profile tezos` (the default) watches `tz2RDjqC2bpUPvy43C7DNFNUuV6Ma5R9fcab`. `--profile etherlink` watches `0xb4a28bec10175315bafce05c5d474cee14e18971`. `--unlocks` defaults to 5. The first sample of a repeated probe is left out of the median once there are at least three. `--no-warmup` skips the fill. `--out` chooses the folder; the default is `perf/out/cmp-<time>/`.

`--flow unlock|tokens|nfts|network|jank` measures that probe after the setup it needs. `--iterations N` repeats the selected probe; it requires `--flow`. A network iteration is one tokens pass and one collectibles pass, because those requests are what the cache counters measure. Unlock still repeats `--unlocks` times when no flow is selected. The other probes then run once.

```bash
yarn perf --platform ios --profile etherlink --flow tokens --iterations 5 base=TW-2411-only-add-tests-selectors mine=.
```

Each version is installed from a git worktree under that folder. A failed release build stops the comparison before its scenarios, and before the next version. `mine=.` is the current checkout and is left as it is, and it is built on every run. A worktree does not contain ignored files, so the keystore, `.env`, `local.properties`, Sentry properties, and `.xcode.env.local` are copied from the current checkout. A release build of a git commit is saved in `perf/out/builds/<platform>/<commit>-<env>/`. The next comparison of that commit installs the saved APK or simulator app. The directory name includes a hash of `.env`, which the release build embeds. Release builds cannot export their data, so setup runs again for each version: import a wallet, hold Settings for 4.5 seconds, then import the watch-only address. Maestro's own long press stops at 3 seconds, so that hold is one stationary swipe at the button, which can last 4.5 seconds. The rest of the screen stays in the normal Maestro flow. The shared `TW_API_CACHE` directory is what makes the server answers match. After setup, and before the timed probes, the script runs `python3 api-cache.py --fill` while the app is idle.

Each flow writes its Maestro screenshots, log, and screen recording under `artifacts/<version>/` in the comparison folder. A host recording fills `video.mp4` on iOS, and `video.webm` on an Android emulator, when that run is not already being recorded. The emulator writes that file itself, so stopping the recording does not encode it again. A physical Android device still uses `screenrecord`, which stops after three minutes. On Android, each of those flows also writes an `.perfetto-trace` in the same folder. The session runs until the flow ends, so a long import keeps a large file. On iOS, each flow is recorded with xctrace using the Animation Hitches template, the same way as `xctrace-test.sh`. That template keeps the Time Profiler chart and adds hitch and hang rows. The `.trace` opens in Xcode. The measured time stays the Maestro run. Crash reports from that version's run are copied into `artifacts/<version>/crashes/`.

Each flow also records a Hermes sample profile. The symbolicated trace is `artifacts/<version>/<flow>/hermes/profile.json`, next to the raw `profile.cpuprofile` and the build's `bundle.map`. The source map on its own has no samples. In the profile, a re-render is time spent in that component while Maestro was waiting. A cached build made before this keeps its samples as bytecode offsets until that commit is built again.

Open one flow's base and mine profiles in two tabs of the default browser:

```bash
yarn perf:hermes cmp-2026-11-25-10-59-46 nfts-1-scroll
```

The first tab is base and the second is mine. The pages are the local Perfetto UI v59.1, because ui.perfetto.dev is not allowed to read a file served on this machine. The first run downloads that UI into `perf/out/perfetto-ui/`. Leave the command running while the tabs are open.

The report is `report.md` in the comparison folder. The headline follows freeze counts. A freeze on Android is the next frame starting at least 100 ms, and less than 2 s, after the previous one. A freeze on iOS is a hitch or a hang of at least 100 ms in Temple Wallet, and the report keeps the larger of those two counts. Counts are "same" within 3 or 10%. Fewer freezes is better. Maestro timings stay in the table, because its animation waits move them, and they do not change the headline. When a folder has no freeze counts, the headline falls back to those timings. Timings are "same" when the medians differ by less than 10% or the ranges overlap. Trust fails when a version got more than 100 throttled answers or never reached the token list. Print it again with `node perf/results.mjs <folder>`.

## Reading a Perfetto trace

Open an `.perfetto-trace` from `artifacts/<version>/<flow>/` at [ui.perfetto.dev](https://ui.perfetto.dev) with **Open trace file**. The file stays in the browser. `yarn perf:hermes` does not open this file. That command opens the Hermes profile, which is JavaScript samples.

In the search box, type `com.templewallet` and pin these tracks:

| Track | What it shows |
| --- | --- |
| `mqt_v_js` | JavaScript running. A colored stretch is time on a CPU. A gap is the thread waiting. |
| `om.templewallet` | The main thread. The kernel name is cut off at 15 characters. |
| `RenderThread` | Drawing the frame. |

Click a slice. The details panel shows its duration. On the main thread, slices named `Choreographer#doFrame` are frames. At 60 Hz, longer than about 16 ms is late. A wide empty gap between those slices, while the list is moving, is a freeze. `previousFramePending` on `surfaceflinger` marks a frame the display did not finish in time.

For the totals, open the **Query (SQL)** tab in that same UI and run:

```sql
SELECT t.name, SUM(s.dur) / 1e9 AS cpu_s
FROM sched_slice s
JOIN thread t ON s.utid = t.utid
JOIN process p ON t.upid = p.upid
WHERE p.name = 'com.templewallet'
GROUP BY t.name
ORDER BY cpu_s DESC
```

`cpu_s` is seconds that thread was scheduled. The main thread, `mqt_v_js`, and `RenderThread` are the ones that match the tracks above.

```sql
SELECT
  COUNT(*) AS frames,
  MAX(s.dur) / 1e6 AS max_ms,
  SUM(CASE WHEN s.dur > 16666666 THEN 1 ELSE 0 END) AS over_16ms,
  SUM(CASE WHEN s.dur > 100000000 THEN 1 ELSE 0 END) AS over_100ms
FROM slice s
JOIN thread_track tt ON s.track_id = tt.id
JOIN thread t ON tt.utid = t.utid
JOIN process p ON t.upid = p.upid
WHERE p.name = 'com.templewallet'
  AND s.name = 'Choreographer#doFrame'
  AND s.dur > 0
```

`over_16ms` counts late frames. `over_100ms` counts the long callbacks. The report's freeze count is the gaps between those frames. This emulator often records no `cpu_frequency` track, so an empty frequency row means the counter was not traced.

On iOS, open the flow's `.trace` in Xcode. The Animation Hitches template plots the Time Profiler and lists Hitches and Hangs. A hitch or hang of at least 100 ms is the freeze the report counts.

`yarn android:hermes` and `yarn ios:hermes` still record one profile of the import flow on their own.

Flashlight stays `yarn android:flashlight`. It cannot run beside Perfetto.
