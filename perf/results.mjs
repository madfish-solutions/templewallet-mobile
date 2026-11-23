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
  const data = { name, unlock: [], tokens: [], nfts: [], network: [], jank: [], unfinished: [], ran: new Set() };
  for (const probe of PROBES) {
    const file = path.join(dir, `${name}-${probe}.log`);
    if (!fs.existsSync(file)) continue;
    data.ran.add(probe);
    for (const row of readResults(file)) {
      if (row.ok === false) {
        if (!data.unfinished.includes(probe)) data.unfinished.push(probe);
        continue;
      }
      data[probe].push(row);
    }
    if (!data[probe].length && !data.unfinished.includes(probe)) data.unfinished.push(probe);
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

/** The first run does extra first-session work. Leave it out once there are enough runs. */
const samples = rows => ((rows ?? []).length >= 3 ? rows.slice(1) : (rows ?? []));

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
  const throttled = median(samples(data.network).map(row => row.throttled));
  if (data.ran.has('network') && throttled > 100) issues.push(`${data.name} got more than 100 throttled answers`);
  if (data.ran.has('tokens') && data.tokens.length && !data.tokens.some(row => row.reached))
    issues.push(`${data.name} did not reach the token list`);
  return issues;
};

const METRICS = [
  {
    label: 'Unlock, password screen',
    kind: 'time',
    probe: 'unlock',
    values: data => samples(data.unlock).map(row => row.screenMs)
  },
  {
    label: 'Unlock, wallet',
    kind: 'time',
    probe: 'unlock',
    values: data => samples(data.unlock).map(row => row.walletMs)
  },
  {
    label: 'Tokens, list visible',
    kind: 'time',
    probe: 'tokens',
    values: data => samples(data.tokens).map(row => row.openMs)
  },
  {
    label: 'Tokens, scroll',
    kind: 'time',
    probe: 'tokens',
    values: data => samples(data.tokens).map(row => row.scrollMs)
  },
  {
    label: 'Collectibles, list visible',
    kind: 'time',
    probe: 'nfts',
    values: data => samples(data.nfts).map(row => row.openMs)
  },
  {
    label: 'Collectibles, scroll',
    kind: 'time',
    probe: 'nfts',
    values: data => samples(data.nfts).map(row => row.scrollMs)
  },
  {
    label: 'Cache hits',
    kind: 'count',
    probe: 'network',
    fewerBetter: false,
    values: data => samples(data.network).map(row => row.hits)
  },
  {
    label: 'Cache recorded',
    kind: 'count',
    probe: 'network',
    fewerBetter: true,
    values: data => samples(data.network).map(row => row.recorded)
  },
  {
    label: 'Throttled answers',
    kind: 'count',
    probe: 'network',
    fewerBetter: true,
    values: data => samples(data.network).map(row => row.throttled)
  }
];

const countRange = values => {
  const numbers = finite(values);
  if (!numbers.length) return '—';
  const mid = String(median(numbers));
  if (numbers.length === 1) return mid;
  return `${mid} (${Math.min(...numbers)}–${Math.max(...numbers)})`;
};

const cell = (metric, data) => (metric.kind === 'time' ? range(metric.values(data)) : countRange(metric.values(data)));

const verdictFor = (metric, own, base) => {
  if (metric.kind === 'time') return compareTimings(metric.values(own), metric.values(base));
  return compareCounts(median(metric.values(own)), median(metric.values(base)), metric.fewerBetter);
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
  if (!changes.length) return 'The measured rows match within the usual range.';
  return changes.join(' ');
};

export const writeReport = dir => {
  const names = versionNames(dir);
  const versions = names.map(name => load(dir, name));
  const expected = new Set(versions.flatMap(data => [...data.ran]));
  for (const data of versions) {
    for (const probe of expected) {
      if (!data.ran.has(probe)) data.unfinished.push(probe);
    }
  }
  const base = versions[0];
  const rows = METRICS.filter(metric => versions.some(data => data.ran.has(metric.probe))).map(metric => ({
    label: metric.label,
    cells: versions.map(data => cell(metric, data)),
    verdicts: versions.slice(1).map(data => (base ? verdictFor(metric, data, base) : null))
  }));

  const jankLine = version => {
    const traces = version.jank.map(row => row.trace).filter(Boolean);
    if (!traces.length) return 'missing';
    if (traces.length === 1) return `recorded (${traces[0]})`;
    return `${traces.length} traces`;
  };
  const jankRan = versions.some(data => data.ran.has('jank'));

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

  if (jankRan) {
    const jankCells = versions.map(jankLine);
    const jankVerdicts = versions.slice(1).map(version => {
      if (!base) return null;
      if (base.jank.length && version.jank.length) return 'same';
      return 'broken';
    });
    lines.push(
      `| Tokens scroll trace | ${jankCells
        .map((value, index) =>
          index === 0 || !jankVerdicts[index - 1] ? value : `${value} · ${jankVerdicts[index - 1]}`
        )
        .join(' | ')} |`
    );
  }

  lines.push('', '## Details', '');
  for (const version of versions) {
    lines.push(`### ${version.name}`, '');
    if (version.ran.has('unlock')) {
      if (!version.unlock.length) lines.push('Unlock: no finished run.');
      version.unlock.forEach((row, index) => {
        const dropped = version.unlock.length >= 3 && index === 0 ? ' (dropped)' : '';
        lines.push(
          `Unlock ${index + 1}${dropped}: password screen ${time(row.screenMs)}, wallet ${time(row.walletMs)}.`
        );
      });
    }
    if (version.ran.has('tokens')) {
      if (!version.tokens.length) lines.push('Tokens: no finished run.');
      version.tokens.forEach((row, index) => {
        const dropped = version.tokens.length >= 3 && index === 0 ? ' (dropped)' : '';
        lines.push(`Tokens ${index + 1}${dropped}: list ${time(row.openMs)}, scroll ${time(row.scrollMs)}.`);
      });
    }
    if (version.ran.has('nfts')) {
      if (!version.nfts.length) lines.push('Collectibles: no finished run.');
      version.nfts.forEach((row, index) => {
        const dropped = version.nfts.length >= 3 && index === 0 ? ' (dropped)' : '';
        lines.push(`Collectibles ${index + 1}${dropped}: list ${time(row.openMs)}, scroll ${time(row.scrollMs)}.`);
      });
    }
    if (version.ran.has('network')) {
      if (!version.network.length) lines.push('Network: no counters.');
      version.network.forEach((row, index) => {
        const dropped = version.network.length >= 3 && index === 0 ? ' (dropped)' : '';
        lines.push(
          `Network ${index + 1}${dropped}: hits ${row.hits ?? 0}, recorded ${row.recorded ?? 0}, throttled ${row.throttled ?? 0}.`
        );
      });
    }
    if (version.ran.has('jank')) lines.push(`Trace: ${jankLine(version)}.`);
    lines.push('');
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
