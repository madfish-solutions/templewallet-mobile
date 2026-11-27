// Counts UI freezes in one flow's trace.
// Android: a freeze is the next frame starting 100ms to 2s after the previous one.
// iOS: a freeze is an Animation Hitches row, or a hang, that lasted at least 100ms.
// The larger of those two iOS counts is kept, so one stall is not counted twice.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FREEZE_NS = 100_000_000;
const IDLE_NS = 2_000_000_000;
const PROCESSOR_URL = 'https://commondatastorage.googleapis.com/perfetto-luci-artifacts/v59.1';

const processorName = () => {
  const host = process.platform === 'darwin' ? 'mac' : process.platform === 'linux' ? 'linux' : '';
  const arch = process.arch === 'arm64' ? 'arm64' : process.arch === 'x64' ? 'x64' : '';
  return host && arch ? `${host}-${arch}` : '';
};

const traceProcessor = () => {
  const binary = path.join(root, 'perf', 'out', 'tools', 'trace_processor_shell');
  if (fs.existsSync(binary)) return binary;
  const name = processorName();
  if (!name) {
    process.stderr.write('No Perfetto trace processor build for this machine.\n');
    return null;
  }
  fs.mkdirSync(path.dirname(binary), { recursive: true });
  process.stdout.write('Downloading Perfetto trace processor v59.1\n');
  const downloaded = spawnSync(
    'curl',
    ['-fL', '--retry', '3', '-o', binary, `${PROCESSOR_URL}/${name}/trace_processor_shell`],
    { stdio: 'inherit' }
  );
  if (downloaded.status !== 0) {
    process.stderr.write('Could not download the Perfetto trace processor.\n');
    fs.rmSync(binary, { force: true });
    return null;
  }
  fs.chmodSync(binary, 0o755);
  return binary;
};

const query = (trace, sql) => {
  const binary = traceProcessor();
  if (!binary) return null;
  const result = spawnSync(binary, ['-Q', sql, trace], { encoding: 'utf8', timeout: 120000 });
  if (result.error || result.status !== 0) {
    process.stderr.write(`Could not read freezes from ${trace}\n`);
    return null;
  }
  const row = result.stdout
    .split('\n')
    .map(line => line.trim())
    .filter(line => /^"?\d/.test(line))
    .at(-1);
  if (!row) return null;
  return [...row.matchAll(/"([^"]*)"|([^,]+)/g)].map(match => (match[1] ?? match[2]).trim());
};

/** Rows whose duration column is at least `minNs`. Repeated duration refs count again. */
export const countLongDurations = (xml, minNs, processName) => {
  const known = new Map();
  for (const match of xml.matchAll(/<duration\b([^>]*?)(?:\/>|>(\d+)<\/duration>)/g)) {
    const id = match[1].match(/\bid="(\d+)"/)?.[1];
    if (id && match[2]) known.set(id, Number(match[2]));
  }
  const processes = new Map();
  for (const match of xml.matchAll(/<process\b([^>]*?)\bfmt="([^"]*)"/g)) {
    const id = match[1].match(/\bid="(\d+)"/)?.[1];
    if (id) processes.set(id, match[2]);
  }
  let freezes = 0;
  let longestNs = 0;
  for (const match of xml.matchAll(/<row>([\s\S]*?)<\/row>/g)) {
    const body = match[1];
    if (processName) {
      const inline = body.match(/<process\b[^>]*\bfmt="([^"]*)"/);
      const ref = body.match(/<process\b[^>]*\bref="(\d+)"/);
      const name = inline?.[1] ?? (ref ? processes.get(ref[1]) : undefined);
      if (!name?.includes(processName)) continue;
    }
    const inline = body.match(/<duration\b[^>]*>(\d+)<\/duration>/);
    const ref = body.match(/<duration\b[^>]*\bref="(\d+)"/);
    const duration = inline ? Number(inline[1]) : ref ? known.get(ref[1]) : undefined;
    if (!Number.isFinite(duration) || duration < minNs) continue;
    freezes += 1;
    longestNs = Math.max(longestNs, duration);
  }
  return { freezes, longestMs: freezes ? longestNs / 1e6 : null };
};

const exportTable = (trace, schema) => {
  const result = spawnSync(
    'xcrun',
    [
      'xctrace',
      'export',
      '--input',
      trace,
      '--xpath',
      `/trace-toc/run[@number="1"]/data/table[@schema="${schema}"]`
    ],
    { encoding: 'utf8', timeout: 180000 }
  );
  if (result.status !== 0) return null;
  return result.stdout;
};

const androidFreezes = (trace, appId) => {
  const sql = `
WITH frames AS (
  SELECT s.ts AS ts
  FROM slice s
  JOIN thread_track tt ON s.track_id = tt.id
  JOIN thread t ON tt.utid = t.utid
  JOIN process p ON t.upid = p.upid
  WHERE p.name = '${appId}' AND s.name = 'Choreographer#doFrame' AND s.dur > 0
),
ordered AS (
  SELECT LEAD(ts) OVER (ORDER BY ts) - ts AS gap
  FROM frames
)
SELECT
  (SELECT COUNT(*) FROM frames) AS frames,
  COALESCE(SUM(CASE WHEN gap >= ${FREEZE_NS} AND gap < ${IDLE_NS} THEN 1 ELSE 0 END), 0) AS freezes,
  MAX(CASE WHEN gap >= ${FREEZE_NS} AND gap < ${IDLE_NS} THEN gap / 1e6 END) AS longest_ms
FROM ordered;
`;
  const values = query(trace, sql);
  if (!values) return null;
  const frames = Number(values[0]);
  if (!Number.isFinite(frames) || frames < 1) return null;
  const freezes = Number(values[1]);
  const longest = Number(values[2]);
  if (!Number.isFinite(freezes)) return null;
  return { freezes, longestMs: Number.isFinite(longest) ? longest : null };
};

const iosFreezes = trace => {
  const tables = ['hitches', 'potential-hangs'].map(schema => exportTable(trace, schema));
  if (tables.every(xml => xml == null)) return null;
  let freezes = 0;
  let longestMs = null;
  for (const xml of tables) {
    if (!xml) continue;
    const counted = countLongDurations(xml, FREEZE_NS, 'TempleWallet');
    if (counted.freezes > freezes) freezes = counted.freezes;
    if (Number.isFinite(counted.longestMs)) longestMs = Math.max(longestMs ?? 0, counted.longestMs);
  }
  return { freezes, longestMs };
};

export const countFreezes = (platform, trace, appId = 'com.templewallet') => {
  if (!trace || !fs.existsSync(trace)) return null;
  if (!/^[\w.]+$/.test(appId)) return null;
  try {
    return platform === 'ios' ? iosFreezes(trace) : androidFreezes(trace, appId);
  } catch {
    process.stderr.write(`Could not read freezes from ${trace}\n`);
    return null;
  }
};
