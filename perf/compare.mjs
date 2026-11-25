// Build two git versions, warm the API cache, and measure the same watch-only wallet.
//   node perf/compare.mjs --platform android base=$(git merge-base HEAD origin/development) mine=.
//   node perf/compare.mjs --platform ios --profile etherlink base=... mine=.
//   node perf/compare.mjs --platform ios --flow tokens --iterations 5 base=... mine=.
//
// Start the proxy first, with TW_API_CACHE pointed at the same directory:
//   TW_API_CACHE=api-cache TW_API_CACHE_FILL=1 mitmdump -s api-cache.py
import { validateAddress, ValidationResult } from '@taquito/utils';
import { isAddress } from 'viem';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { writeReport } from './results.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const PROFILES = {
  tezos: { name: 'whale-tezos', address: 'tz2RDjqC2bpUPvy43C7DNFNUuV6Ma5R9fcab' },
  etherlink: { name: 'whale-etherlink', address: '0xb4a28bec10175315bafce05c5d474cee14e18971' }
};

const APP_IDS = {
  android: 'com.templewallet',
  ios: 'com.madfish.temple-wallet'
};

const FLOW_DEPS = {
  unlock: [],
  tokens: [],
  nfts: [],
  network: ['tokens', 'nfts'],
  jank: []
};
const PROBE_ORDER = ['unlock', 'tokens', 'nfts', 'network', 'jank'];

const usage = () => {
  process.stderr.write(
    'Usage: node perf/compare.mjs --platform android|ios [--profile tezos|etherlink] [--unlocks 5] [--flow unlock|tokens|nfts|network|jank] [--iterations N] [--no-warmup] [--out dir] name=ref ...\n'
  );
  process.exit(1);
};

const args = process.argv.slice(2);
let platform;
let profileName = 'tezos';
let unlocks = 5;
let whaleAccount;
let flowName;
let iterations;
let warmup = true;
let outDir;
const versions = [];

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === '--platform') platform = args[++index];
  else if (arg === '--profile') profileName = args[++index];
  else if (arg === '--account') whaleAccount = args[++index];
  else if (arg === '--unlocks') unlocks = Number(args[++index]);
  else if (arg === '--flow') flowName = args[++index];
  else if (arg === '--iterations') iterations = Number(args[++index]);
  else if (arg === '--no-warmup') warmup = false;
  else if (arg === '--out') outDir = args[++index];
  else if (arg.includes('=')) {
    const eq = arg.indexOf('=');
    versions.push({ name: arg.slice(0, eq), source: arg.slice(eq + 1) });
  } else usage();
}

if (
  !APP_IDS[platform] ||
  (
    !PROFILES[profileName] &&
    (!whaleAccount || (validateAddress(whaleAccount) !== ValidationResult.VALID && !isAddress(whaleAccount)))
  ) ||
  !Number.isInteger(unlocks) ||
  unlocks < 1 ||
  (flowName && !FLOW_DEPS[flowName]) ||
  (iterations !== undefined && (!flowName || !Number.isInteger(iterations) || iterations < 1)) ||
  !versions.length
)
  usage();

const repeatCount = probe => {
  if (flowName && probe !== flowName) return 1;
  if (probe === flowName && iterations) return iterations;
  return probe === 'unlock' ? unlocks : 1;
};
const activeProbes = flowName
  ? PROBE_ORDER.filter(probe => probe === flowName || FLOW_DEPS[flowName].includes(probe))
  : PROBE_ORDER;

const profile = whaleAccount ? { name: 'custom', address: whaleAccount } : PROFILES[profileName];
const appId = APP_IDS[platform];
let maestroDevice = '';
const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
const dir = path.resolve(outDir ?? path.join(root, 'perf', 'out', `cmp-${stamp}`));
const cacheDir = path.resolve(process.env.TW_API_CACHE ?? path.join(dir, 'api-cache'));
const buildCacheRoot = path.join(root, 'perf', 'out', 'builds');

const run = (command, commandArgs, { cwd = root, env = process.env, log, quiet = false } = {}) =>
  new Promise(resolve => {
    const child = spawn(command, commandArgs, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    const started = Date.now();
    const collect = chunk => {
      const text = chunk.toString();
      out += text;
      if (!quiet) process.stdout.write(text);
    };
    child.stdout.on('data', collect);
    child.stderr.on('data', collect);
    child.on('close', code => {
      if (log) fs.appendFileSync(log, out);
      resolve({ ms: Date.now() - started, status: code ?? 1, out });
    });
  });

const resultLine = (log, payload) => {
  fs.appendFileSync(log, `RESULT ${JSON.stringify(payload)}\n`);
};

const deviceEnv = () => (maestroDevice ? { MAESTRO_DEVICE: maestroDevice, HERMES_DEVICE: maestroDevice } : {});

const measureEnv = () => {
  const env = {
    ...process.env,
    ...deviceEnv(),
    APP_ID: appId,
    HERMES_PROFILE: '1',
    WHALE_NAME: profile.name,
    WHALE_ADDRESS: profile.address
  };
  delete env.MYAPP_UPLOAD_STORE_PASSWORD;
  delete env.MYAPP_UPLOAD_KEY_PASSWORD;
  delete env.TW_API_CACHE_FILL;
  return env;
};

const relaunches = new Set(['maestro/import-wallet.yaml', 'maestro/perf-unlock-screen.yaml', 'maestro/perf-jank.yaml']);

const maestro = async (flow, log, artifacts) => {
  // iOS flows go through xctrace so the folder contains a .trace Xcode can chart.
  // MAESTRO_MS is the Maestro run, without the wait to flush that trace.
  if (platform === 'ios' && artifacts) {
    const traced = await run('bash', [path.join(root, 'xctrace-test.sh')], {
      env: {
        ...measureEnv(),
        MAESTRO_FLOW: flow,
        MAESTRO_ARTIFACTS: artifacts,
        XCTRACE_OUT_DIR: artifacts,
        XCTRACE_RELAUNCH: relaunches.has(flow) ? '1' : '0',
        HOST_VIDEO: '0',
        ...(maestroDevice ? { XCTRACE_DEVICE: maestroDevice } : {})
      },
      log
    });
    const timed = traced.out.match(/^MAESTRO_MS (\d+)$/m);
    return { ...traced, ms: timed ? Number(timed[1]) : traced.ms };
  }
  return run('bash', [path.join(root, 'maestro-test.sh'), flow], {
    env: { ...measureEnv(), ...(artifacts ? { MAESTRO_ARTIFACTS: artifacts } : {}) },
    log
  });
};

const readStats = () => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(cacheDir, 'stats.json'), 'utf8'));
    return {
      hits: data.hits ?? 0,
      recorded: data.recorded ?? 0,
      throttled: data.throttled ?? 0
    };
  } catch {
    return { hits: 0, recorded: 0, throttled: 0 };
  }
};

const ignoredBuildFiles = () => {
  const files = ['android/local.properties', 'android/sentry.properties', 'ios/sentry.properties', 'ios/.xcode.env.local'];
  for (const name of fs.readdirSync(root)) {
    if (name === '.env' || (name.startsWith('.env.') && name !== '.env.dist')) files.push(name);
  }
  const appDir = path.join(root, 'android', 'app');
  if (fs.existsSync(appDir)) {
    for (const name of fs.readdirSync(appDir)) {
      if (name.endsWith('.keystore') && name !== 'debug.keystore') files.push(path.join('android', 'app', name));
    }
  }
  return files;
};

/** A worktree has no ignored files. Copy the ones a release build reads. */
const copyIgnoredBuildFiles = dest => {
  const copied = [];
  for (const relative of ignoredBuildFiles()) {
    const from = path.join(root, relative);
    if (!fs.existsSync(from) || !fs.statSync(from).isFile()) continue;
    const to = path.join(dest, relative);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
    copied.push(relative);
  }
  if (copied.length) process.stdout.write(`Copied ignored build files: ${copied.join(', ')}\n`);
};

const checkoutDirectory = source => {
  const direct = source === '.' ? root : path.resolve(source);
  return fs.existsSync(path.join(direct, 'package.json')) ? direct : null;
};

// Release builds embed .env, so a changed file is a different app than this commit.
const envStamp = () => {
  const file = path.join(root, '.env');
  const data = fs.existsSync(file) ? fs.readFileSync(file) : Buffer.alloc(0);
  return crypto.createHash('sha256').update(data).digest('hex').slice(0, 16);
};

const artifactIn = cachePath =>
  path.join(cachePath, platform === 'android' ? 'app-release.apk' : 'TempleWallet.app');

const artifactReady = file =>
  platform === 'android' ? fs.existsSync(file) && fs.statSync(file).isFile() : fs.existsSync(file);

const resolveCommit = async source => {
  const parsed = await run('git', ['rev-parse', '--verify', `${source}^{commit}`], { quiet: true });
  const commit = parsed.out.trim().split('\n').pop()?.trim() ?? '';
  if (parsed.status !== 0 || !/^[0-9a-f]{40}$/.test(commit)) throw new Error(`Could not resolve ${source}`);
  return commit;
};

const prepare = async version => {
  const direct = checkoutDirectory(version.source);
  if (direct) return { checkout: direct, cachePath: null, artifact: null, commit: null };

  const commit = await resolveCommit(version.source);
  const cachePath = path.join(buildCacheRoot, platform, `${commit}-${envStamp()}`);
  const artifact = artifactIn(cachePath);
  if (artifactReady(artifact)) {
    process.stdout.write(`Using cached ${platform} build ${commit.slice(0, 12)}\n`);
    return { checkout: null, cachePath, artifact, commit };
  }

  const dest = path.join(dir, 'src', version.name);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const added = await run('git', ['worktree', 'add', '--detach', dest, commit], { cwd: root });
  if (added.status !== 0) throw new Error(`Could not check out ${version.source}`);
  copyIgnoredBuildFiles(dest);
  const installed = await run('yarn', ['install'], { cwd: dest });
  if (installed.status !== 0) throw new Error(`yarn install failed in ${dest}`);
  if (platform === 'ios' && !fs.existsSync(path.join(dest, 'ios', 'Pods'))) {
    const pods = await run('yarn', ['ios:pods'], { cwd: dest });
    if (pods.status !== 0) throw new Error(`pod install failed in ${dest}`);
  }
  return { checkout: dest, cachePath, artifact: null, commit };
};

const hermesMap = version => path.join(dir, 'artifacts', version.name, 'hermes', 'bundle.map');

const placeHermesMap = version => {
  const dest = hermesMap(version);
  if (fs.existsSync(dest) || !version.cachePath) return;
  const cached = path.join(version.cachePath, 'bundle.map');
  if (!fs.existsSync(cached)) return;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(cached, dest);
};

const install = version => {
  const { checkout, cachePath, artifact } = version;
  const script = platform === 'android' ? 'android-test.sh' : 'ios-hermes.sh';
  const map = hermesMap(version);
  if (artifact) {
    placeHermesMap(version);
    return run('bash', [path.join(root, script), 'install-cached', artifact], {
      env: { ...process.env, ...deviceEnv(), APP_ID: appId }
    });
  }
  const env = {
    ...process.env,
    ...deviceEnv(),
    CHECKOUT: checkout,
    APP_ID: appId,
    SENTRY_DISABLE_AUTO_UPLOAD: 'true',
    SOURCEMAP_FILE: map,
    HERMES_SOURCEMAP: map
  };
  if (cachePath) env.BUILD_CACHE = cachePath;
  return run('bash', [path.join(root, script), 'install'], { env });
};

const savedPaths = output => [...output.matchAll(/^Saved (.+)$/gm)].map(match => match[1].trim());

const traceFrom = (output, suffix) => savedPaths(output).find(file => file.endsWith(suffix)) ?? null;

const videoFrom = output => savedPaths(output).filter(file => file.endsWith('.mp4')).at(-1) ?? null;

const jank = async (log, artifacts) => {
  const env = {
    ...measureEnv(),
    SKIP_INSTALL: '1',
    MAESTRO_FLOW: 'maestro/perf-jank.yaml',
    MAESTRO_ARTIFACTS: artifacts
  };
  if (platform === 'android') {
    const traced = await run('bash', [path.join(root, 'android-test.sh'), 'perfetto'], {
      env: { ...env, PERFETTO_OUT: artifacts },
      log
    });
    return { ...traced, trace: traceFrom(traced.out, '.perfetto-trace'), video: videoFrom(traced.out) };
  }
  const traced = await run('bash', [path.join(root, 'xctrace-test.sh')], {
    env: {
      ...env,
      XCTRACE_OUT_DIR: artifacts,
      XCTRACE_RELAUNCH: '1',
      HOST_VIDEO: '0',
      ...(maestroDevice ? { XCTRACE_DEVICE: maestroDevice } : {})
    },
    log
  });
  return { ...traced, trace: traceFrom(traced.out, '.trace'), video: videoFrom(traced.out) };
};

const collectHermes = (version, artifacts, startedAt) => {
  const script = platform === 'android' ? 'android-test.sh' : 'ios-hermes.sh';
  return run('bash', [path.join(root, script), 'collect'], {
    env: {
      ...measureEnv(),
      HERMES_OUT: artifacts,
      HERMES_SOURCEMAP: hermesMap(version),
      HERMES_STARTED: String(Math.floor(startedAt / 1000))
    }
  });
};

// A relaunch drops samples that were recorded in the previous process, so those
// flows start sampling themselves once the new process is up. Every other flow
// is bracketed here. The stop link writes the file the collect step converts.
const maestroProfiled = async (version, flow, log, artifacts) => {
  const startedAt = Date.now();
  if (!relaunches.has(flow)) await maestro('maestro/hermes-start.yaml', log);
  const result = await maestro(flow, log, artifacts);
  await maestro('maestro/hermes-stop.yaml', log);
  await collectHermes(version, path.join(artifacts, 'hermes'), startedAt);
  return result;
};

const collectCrashes = async (version, startedAt) => {
  const dest = path.join(dir, 'artifacts', version.name, 'crashes');
  if (platform === 'ios') {
    const reports = path.join(process.env.HOME ?? '', 'Library', 'Logs', 'DiagnosticReports');
    if (!fs.existsSync(reports)) return;
    const copied = [];
    for (const name of fs.readdirSync(reports)) {
      if (!/^TempleWallet.*\.ips$/.test(name)) continue;
      const from = path.join(reports, name);
      if (fs.statSync(from).mtimeMs < startedAt - 5000) continue;
      fs.mkdirSync(dest, { recursive: true });
      fs.copyFileSync(from, path.join(dest, name));
      copied.push(name);
    }
    if (copied.length) process.stdout.write(`Copied crash reports: ${copied.join(', ')}\n`);
    return;
  }
  const started = new Date(startedAt - 5000);
  const pad = value => String(value).padStart(2, '0');
  const from = `${pad(started.getMonth() + 1)}-${pad(started.getDate())} ${pad(started.getHours())}:${pad(started.getMinutes())}:${pad(started.getSeconds())}.000`;
  const crashed = await run('adb', ['logcat', '-b', 'crash', '-d', '-t', from], { quiet: true });
  const body = crashed.out
    .split('\n')
    .filter(line => line && !line.startsWith('---------'))
    .join('\n');
  if (crashed.status !== 0 || !body.trim()) return;
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, 'logcat-crash.txt'), `${body}\n`);
  process.stdout.write(`Saved ${path.join(dest, 'logcat-crash.txt')}\n`);
};

const measure = async version => {
  const startedAt = Date.now();
  const slot = name => path.join(dir, 'artifacts', version.name, name);
  try {
    const log = probe => path.join(dir, `${version.name}-${probe}.log`);
    const setupLog = log('setup');
    fs.writeFileSync(setupLog, '');
    // Empty logs stay behind when setup stops, so the report treats those probes as unfinished.
    for (const probe of activeProbes) fs.writeFileSync(log(probe), '');

    const installed = await install(version);
    fs.appendFileSync(setupLog, installed.out);
    if (installed.status !== 0) {
      throw new Error(`The release build of ${version.name} failed. The log is ${setupLog}`);
    }

    const imported = await maestroProfiled(version, 'maestro/import-wallet.yaml', setupLog, slot('setup-import'));
    if (imported.status !== 0) return;
    // Maestro's long press always lasts 3s. Settings opens Debug after 4s, so the
    // hold is injected here and the flow continues in Maestro.
    const held = await run(process.execPath, [path.join(root, 'perf', 'long-press-settings.mjs')], {
      env: { ...measureEnv(), MAESTRO_ARTIFACTS: slot('setup-settings') },
      log: setupLog
    });
    if (held.status !== 0) return;
    const watched = await maestroProfiled(version, 'maestro/perf-watch-only.yaml', setupLog, slot('setup-watch'));
    if (watched.status !== 0) return;

    if (warmup) {
      const filled = await run('python3', [path.join(root, 'api-cache.py'), '--fill'], {
        env: { ...process.env, TW_API_CACHE: cacheDir },
        log: setupLog
      });
      if (filled.status !== 0) return;
    }

    const runs = async (times, once) => {
      for (let index = 0; index < times; index += 1) await once(index);
    };

    if (activeProbes.includes('unlock')) {
      const unlockLog = log('unlock');
      await runs(repeatCount('unlock'), async index => {
        const screen = await maestroProfiled(
          version,
          'maestro/perf-unlock-screen.yaml',
          unlockLog,
          slot(`unlock-${index + 1}-screen`)
        );
        const wallet = await maestroProfiled(
          version,
          'maestro/perf-unlock-wallet.yaml',
          unlockLog,
          slot(`unlock-${index + 1}-wallet`)
        );
        resultLine(unlockLog, {
          probe: 'unlock',
          screenMs: screen.ms,
          walletMs: wallet.ms,
          ok: screen.status === 0 && wallet.status === 0
        });
      });
    }

    const tokensLog = log('tokens');
    const runTokens = async index => {
    const tokensOpen = await maestroProfiled(
      version,
      'maestro/perf-tokens-open.yaml',
      tokensLog,
      slot(`tokens-${index + 1}-open`)
    );
    const tokensScroll = await maestroProfiled(
      version,
      'maestro/perf-tokens-scroll.yaml',
      tokensLog,
      slot(`tokens-${index + 1}-scroll`)
    );
      resultLine(tokensLog, {
        probe: 'tokens',
        openMs: tokensOpen.ms,
        scrollMs: tokensScroll.ms,
        reached: tokensOpen.status === 0,
        ok: tokensOpen.status === 0 && tokensScroll.status === 0
      });
      return tokensOpen.status === 0 && tokensScroll.status === 0;
    };

    const nftsLog = log('nfts');
    const runNfts = async index => {
    const nftsOpen = await maestroProfiled(version, 'maestro/perf-nfts-open.yaml', nftsLog, slot(`nfts-${index + 1}-open`));
    const nftsScroll = await maestroProfiled(
      version,
      'maestro/perf-nfts-scroll.yaml',
      nftsLog,
      slot(`nfts-${index + 1}-scroll`)
    );
      resultLine(nftsLog, {
        probe: 'nfts',
        openMs: nftsOpen.ms,
        scrollMs: nftsScroll.ms,
        reached: nftsOpen.status === 0,
        ok: nftsOpen.status === 0 && nftsScroll.status === 0
      });
      return nftsOpen.status === 0 && nftsScroll.status === 0;
    };

    if (flowName === 'network') {
      const networkLog = log('network');
      await runs(repeatCount('network'), async index => {
        const before = readStats();
        const tokensOk = await runTokens(index);
        const nftsOk = await runNfts(index);
        const after = readStats();
        resultLine(networkLog, {
          probe: 'network',
          hits: after.hits - before.hits,
          recorded: after.recorded - before.recorded,
          throttled: after.throttled - before.throttled,
          ok: tokensOk && nftsOk
        });
      });
    } else {
      const before = activeProbes.includes('network') ? readStats() : null;
      if (activeProbes.includes('tokens')) await runs(repeatCount('tokens'), runTokens);
      if (activeProbes.includes('nfts')) await runs(repeatCount('nfts'), runNfts);
      if (before) {
        const after = readStats();
        resultLine(log('network'), {
          probe: 'network',
          hits: after.hits - before.hits,
          recorded: after.recorded - before.recorded,
          throttled: after.throttled - before.throttled
        });
      }
    }

    if (activeProbes.includes('jank')) {
      const jankLog = log('jank');
      await runs(repeatCount('jank'), async index => {
        const jankSlot = slot(`jank-${index + 1}`);
        const jankStarted = Date.now();
        const traced = await jank(jankLog, jankSlot);
        await maestro('maestro/hermes-stop.yaml', jankLog);
        await collectHermes(version, path.join(jankSlot, 'hermes'), jankStarted);
        resultLine(jankLog, {
          probe: 'jank',
          trace: traced.trace,
          video: traced.video,
          ok: traced.status === 0 && Boolean(traced.trace)
        });
      });
    }
  } finally {
    await collectCrashes(version, startedAt);
  }
};

const bootedIosSimulators = async () => {
  const listed = await run('xcrun', ['simctl', 'list', 'devices', 'booted'], { quiet: true });
  if (listed.status !== 0) throw new Error('Could not list booted iOS simulators');
  return [...listed.out.matchAll(/\(([0-9A-Fa-f-]{36})\) \(Booted\)/g)].map(match => match[1]);
};

const main = async () => {
  if (platform === 'ios') {
    maestroDevice = process.env.MAESTRO_DEVICE || process.env.HERMES_DEVICE || '';
    if (!maestroDevice) {
      const booted = await bootedIosSimulators();
      if (booted.length !== 1) {
        throw new Error(
          booted.length
            ? 'More than one iOS simulator is booted. Set HERMES_DEVICE to the one that should run the comparison.'
            : 'Boot one iOS simulator before an iOS comparison.'
        );
      }
      maestroDevice = booted[0];
    }
    process.stdout.write(`Maestro will use iOS simulator ${maestroDevice}\n`);
  }

  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(cacheDir, { recursive: true });
  process.stdout.write(`Comparison: ${dir}\n`);
  process.stdout.write(`API cache: ${cacheDir}\n`);
  process.stdout.write(`Watch-only ${profileName}: ${profile.address}\n`);
  if (flowName) process.stdout.write(`Flow ${flowName}, ${repeatCount(flowName)} iteration(s)\n`);

  const builds = [];
  for (const version of versions) {
    const prepared = await prepare(version);
    builds.push({ name: version.name, source: version.source, ...prepared });
  }
  fs.writeFileSync(
    path.join(dir, 'builds.json'),
    JSON.stringify(
      builds.map(({ name, source, commit, checkout, cachePath }) => ({ name, source, commit, checkout, cachePath })),
      null,
      2
    )
  );

  for (const build of builds) {
    process.stdout.write(`\n${build.name} (${build.source})\n`);
    await measure(build);
  }

  writeReport(dir);
};

main().catch(error => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
