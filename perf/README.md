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

Each version is installed from a git worktree under that folder. `mine=.` is the current checkout and is left as it is, and it is built on every run. A worktree does not contain ignored files, so the keystore, `.env`, `local.properties`, Sentry properties, and `.xcode.env.local` are copied from the current checkout. A release build of a git commit is saved in `perf/out/builds/<platform>/<commit>-<env>/`. The next comparison of that commit installs the saved APK or simulator app. The directory name includes a hash of `.env`, which the release build embeds. Release builds cannot export their data, so setup runs again for each version: import a wallet, hold Settings for 4.5 seconds, then import the watch-only address. Maestro's own long press stops at 3 seconds, so that hold is one stationary swipe at the button, which can last 4.5 seconds. The rest of the screen stays in the normal Maestro flow. The shared `TW_API_CACHE` directory is what makes the server answers match. After setup, and before the timed probes, the script runs `python3 api-cache.py --fill` while the app is idle.

The report is `report.md` in the comparison folder. Timings are "same" when the medians differ by less than 10% or the ranges overlap. Counts are "same" within 3 or 10%. Trust fails when a version got more than 100 throttled answers or never reached the token list. Print it again with `node perf/results.mjs <folder>`.

A slow row is a reason to record JavaScript samples, not part of this command:

```bash
yarn android:hermes
yarn ios:hermes
```

Flashlight stays `yarn android:flashlight`. It cannot run beside Perfetto.
