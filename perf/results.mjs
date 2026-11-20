// Turns a comparison folder written by perf/compare.mjs into a report.
//   node perf/results.mjs <folder>
// Reads only the probes' RESULT lines.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROBES = ['unlock', 'tokens', 'nfts', 'network', 'jank'];

const readResults = file => {
  let text = '';
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    return [];
  }
  return [...text.matchAll(/^RESULT (.+)$/gm)].flatMap(match => {
    try {
      return [JSON.parse(match[1])];
    } catch {
      return [];
    }
  });
};

const load = (dir, name) => {
  const data = { name, unlock: [], unfinished: [] };
  for (const probe of PROBES) {
    for (const row of readResults(path.join(dir, `${name}-${probe}.log`))) {
      if (row.ok === false) {
        if (!data.unfinished.includes(probe)) data.unfinished.push(probe);
        continue;
      }
      if (row.probe === 'unlock') data.unlock.push(row);
      else data[row.probe] = row;
    }
  }
  for (const probe of PROBES) {
    const missing = probe === 'unlock' ? data.unlock.length === 0 : !data[probe];
    if (missing && !data.unfinished.includes(probe)) data.unfinished.push(probe);
  }
  return data;
};

const versionNames = dir => {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, 'builds.json'), 'utf8')).map(build => build.name);
  } catch {
    return fs
      .readdirSync(dir)
      .filter(file => file.endsWith('-unlock.log'))
      .map(file => file.slice(0, -'-unlock.log'.length))
      .sort();
  }
};

const finite = values => (values ?? []).filter(Number.isFinite);
const median = values => {
  const sorted = finite(values).sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  if (!sorted.length) return NaN;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};
const time = ms => (!Number.isFinite(ms) ? '—' : ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${Math.round(ms)} ms`);
const times = factor => (factor >= 10 ? String(Math.round(factor)) : factor.toFixed(1));
const range = values => {
  const numbers = finite(values);
  if (!numbers.length) return '—';
  const mid = time(median(numbers));
  if (numbers.length === 1) return mid;
  return `${mid} (${time(Math.min(...numbers))}–${time(Math.max(...numbers))})`;
};

/** The first unlock does extra first-session work. Leave it out once there are enough runs. */
const unlockRuns = data => (data.unlock.length >= 3 ? data.unlock.slice(1) : data.unlock);

const SAME = { word: 'same', tone: 0 };

const compareTimings = (own, base) => {
  const [a, b] = [finite(own), finite(base)];
  if (!a.length || !b.length) return null;
  const overlap = a.length > 1 && b.length > 1 && Math.min(...a) <= Math.max(...b) && Math.max(...a) >= Math.min(...b);
  const factor = median(b) / median(a);
  if (overlap || Math.abs(factor - 1) < 0.1) return SAME;
  return factor > 1
    ? { word: `${times(factor)}× faster`, tone: 1 }
    : { word: `${times(1 / factor)}× slower`, tone: -1 };
};

/** Counts: "same" within 3 or 10%. `fewerBetter` decides which side wins. */
const compareCounts = (own, base, fewerBetter) => {
  if (!Number.isFinite(own) || !Number.isFinite(base)) return null;
  if (Math.abs(own - base) <= Math.max(3, 0.1 * Math.max(own, base))) return SAME;
  const improved = fewerBetter ? own < base : own > base;
  const tone = improved ? 1 : -1;
  const factor = Math.max(own, base) / Math.max(1, Math.min(own, base));
  const fewer = fewerBetter ? tone > 0 : tone < 0;
  if (own > 0 && base > 0 && factor >= 2) return { word: `${times(factor)}× ${fewer ? 'fewer' : 'more'}`, tone };
  return { word: tone > 0 ? 'better' : 'worse', tone };
};

const trustIssues = data => {
  const issues = [];
  if ((data.network?.throttled ?? 0) > 100) issues.push(`${data.name} got more than 100 throttled answers`);
  if (!data.tokens?.reached) issues.push(`${data.name} did not reach the token list`);
  return issues;
};

const METRICS = [
  {
    label: 'Unlock, password screen',
    kind: 'time',
    values: data => unlockRuns(data).map(row => row.screenMs)
  },
  {
    label: 'Unlock, wallet',
    kind: 'time',
    values: data => unlockRuns(data).map(row => row.walletMs)
  },
  { label: 'Tokens, list visible', kind: 'time', values: data => [data.tokens?.openMs] },
  { label: 'Tokens, scroll', kind: 'time', values: data => [data.tokens?.scrollMs] },
  { label: 'Collectibles, list visible', kind: 'time', values: data => [data.nfts?.openMs] },
  { label: 'Collectibles, scroll', kind: 'time', values: data => [data.nfts?.scrollMs] },
  { label: 'Cache hits', kind: 'count', fewerBetter: false, value: data => data.network?.hits },
  { label: 'Cache recorded', kind: 'count', fewerBetter: true, value: data => data.network?.recorded },
  { label: 'Throttled answers', kind: 'count', fewerBetter: true, value: data => data.network?.throttled }
];

const cell = (metric, data) => {
  if (metric.kind === 'time') return range(metric.values(data));
  const value = metric.value(data);
  return Number.isFinite(value) ? String(value) : '—';
};

const verdictFor = (metric, own, base) => {
  if (metric.kind === 'time') return compareTimings(metric.values(own), metric.values(base));
  return compareCounts(metric.value(own), metric.value(base), metric.fewerBetter);
};

const headline = (versions, rows) => {
  if (versions.some(data => data.unfinished.length)) return 'Broken';
  if (versions.some(data => trustIssues(data).length)) return 'Trust';
  const tones = rows.flatMap(row => row.verdicts.map(item => item?.tone)).filter(tone => tone === 1 || tone === -1);
  if (tones.includes(-1)) return 'Worse';
  if (tones.includes(1)) return 'Better';
  return 'Same';
};

const explain = (versions, rows) => {
  const broken = versions.filter(data => data.unfinished.length);
  if (broken.length) {
    return broken.map(data => `${data.name} did not finish: ${data.unfinished.join(', ')}.`).join(' ');
  }
  const trust = versions.flatMap(trustIssues);
  if (trust.length) return `${trust.join('. ')}. The timings are not comparable.`;
  const changes = [];
  for (const row of rows) {
    row.verdicts.forEach((item, index) => {
      if (item && item.tone !== 0) changes.push(`${row.label} on ${versions[index + 1].name} is ${item.word}.`);
    });
  }
  if (!changes.length) return 'Unlock, tokens, collectibles, and the API cache match within the usual range.';
  return changes.join(' ');
};

export const writeReport = dir => {
  const names = versionNames(dir);
  const versions = names.map(name => load(dir, name));
  const base = versions[0];
  const rows = METRICS.map(metric => ({
    label: metric.label,
    cells: versions.map(data => cell(metric, data)),
    verdicts: versions.slice(1).map(data => (base ? verdictFor(metric, data, base) : null))
  }));

  const jankLine = version => {
    const trace = version.jank?.trace;
    return trace ? `recorded (${trace})` : 'missing';
  };

  const title = headline(versions, rows);
  const lines = [`# ${title}`, '', explain(versions, rows), ''];
  if (title === 'Worse') {
    lines.push(
      'A slow row is a reason to record JavaScript samples with yarn android:hermes or yarn ios:hermes.',
      ''
    );
  }
  const columns = names.join(' | ');
  const divider = names.map(() => '---').join(' | ');
  lines.push(`| Metric | ${columns} |`, `| --- | ${divider} |`);

  for (const row of rows) {
    const shown = row.cells.map((value, index) => {
      if (index === 0) return value;
      const verdict = row.verdicts[index - 1];
      return verdict ? `${value} · ${verdict.word}` : value;
    });
    lines.push(`| ${row.label} | ${shown.join(' | ')} |`);
  }

  const jankCells = versions.map(jankLine);
  const jankVerdicts = versions.slice(1).map(version => {
    if (!base) return null;
    if (base.jank?.trace && version.jank?.trace) return 'same';
    return 'broken';
  });
  lines.push(
    `| Tokens scroll trace | ${jankCells
      .map((value, index) =>
        index === 0 || !jankVerdicts[index - 1] ? value : `${value} · ${jankVerdicts[index - 1]}`
      )
      .join(' | ')} |`
  );

  lines.push('', '## Details', '');
  for (const version of versions) {
    lines.push(`### ${version.name}`, '');
    if (!version.unlock.length) lines.push('Unlock: no finished run.');
    version.unlock.forEach((row, index) => {
      const dropped = version.unlock.length >= 3 && index === 0 ? ' (dropped)' : '';
      lines.push(`Unlock ${index + 1}${dropped}: password screen ${time(row.screenMs)}, wallet ${time(row.walletMs)}.`);
    });
    lines.push(`Tokens: list ${time(version.tokens?.openMs)}, scroll ${time(version.tokens?.scrollMs)}.`);
    lines.push(`Collectibles: list ${time(version.nfts?.openMs)}, scroll ${time(version.nfts?.scrollMs)}.`);
    const network = version.network;
    lines.push(
      network
        ? `Network: hits ${network.hits ?? 0}, recorded ${network.recorded ?? 0}, throttled ${network.throttled ?? 0}.`
        : 'Network: no counters.'
    );
    lines.push(`Trace: ${jankLine(version)}.`, '');
  }

  const report = `${lines.join('\n')}\n`;
  fs.writeFileSync(path.join(dir, 'report.md'), report);
  process.stdout.write(report);
  return report;
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const dir = process.argv[2];
  if (!dir) {
    process.stderr.write('Usage: node perf/results.mjs <folder>\n');
    process.exit(1);
  }
  writeReport(dir);
}
