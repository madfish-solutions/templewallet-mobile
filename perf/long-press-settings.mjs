// Hold Wallet/Settings Button long enough to open Debug, then return.
// Maestro's longPressOn always lasts 3 seconds. This button opens Debug after 4.
// Both platforms use one Maestro swipe at the button: that command accepts a
// duration, and a stationary swipe keeps the pointer down for 4.5 seconds.
// The form flow continues afterwards.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const TARGET = 'Wallet/Settings Button';
const HOLD_MS = 4500;

const appId = process.env.APP_ID;
if (!appId) {
  process.stderr.write('Set APP_ID before holding Settings.\n');
  process.exit(1);
}

const capture = (command, args) =>
  spawnSync(command, args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });

// Platform and device are top-level maestro options. hierarchy rejects them
// after its subcommand, and an Android emulator is chosen when one is connected.
const maestroTarget = () => {
  const args = [];
  if (appId === 'com.madfish.temple-wallet') args.push('--platform', 'ios');
  else if (appId === 'com.templewallet') args.push('--platform', 'android');
  if (process.env.MAESTRO_DEVICE) args.push('--device', process.env.MAESTRO_DEVICE);
  return args;
};

const target = maestroTarget();

const boundsCenter = bounds => {
  const match = String(bounds).match(
    /\[(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)\]\[(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)\]/
  );
  if (!match) return null;
  const [left, top, right, bottom] = match.slice(1).map(Number);
  if (right - left < 2 || bottom - top < 2) return null;
  return { x: Math.round((left + right) / 2), y: Math.round((top + bottom) / 2) };
};

const isSettingsButton = attributes => {
  const id = attributes['resource-id'] ?? '';
  const label = attributes.accessibilityText ?? attributes.text ?? '';
  return id === TARGET || id.endsWith(`/${TARGET}`) || label === TARGET;
};

const findInTree = node => {
  if (node?.attributes && isSettingsButton(node.attributes)) {
    const center = boundsCenter(node.attributes.bounds);
    if (center) return center;
  }
  for (const child of node?.children ?? []) {
    const found = findInTree(child);
    if (found) return found;
  }
  return null;
};

const settingsCenter = () => {
  const hierarchy = capture('maestro', [...target, 'hierarchy']);
  if (hierarchy.status !== 0) {
    process.stderr.write(hierarchy.stderr || hierarchy.stdout || 'maestro hierarchy failed\n');
    process.exit(hierarchy.status ?? 1);
  }
  const start = hierarchy.stdout.indexOf('{');
  const end = hierarchy.stdout.lastIndexOf('}');
  if (start < 0 || end < start) return null;
  return findInTree(JSON.parse(hierarchy.stdout.slice(start, end + 1)));
};

const center = settingsCenter();
if (!center) {
  process.stderr.write(`Could not find ${TARGET}.\n`);
  process.exit(1);
}

// One pixel of travel stays inside the button and inside the touch slop,
// and keeps a swipe whose start and end are equal from being dropped.
const end = { x: center.x + 1, y: center.y };
process.stdout.write(`Holding Settings at ${center.x},${center.y} for ${HOLD_MS}ms\n`);

const flow = path.join(os.tmpdir(), 'temple-long-press-settings.yaml');
fs.writeFileSync(
  flow,
  `appId: ${appId}
---
- swipe:
    start: "${center.x}, ${center.y}"
    end: "${end.x}, ${end.y}"
    duration: ${HOLD_MS}
`
);
const testArgs = [...target, 'test'];
if (process.env.MAESTRO_ARTIFACTS) {
  fs.mkdirSync(process.env.MAESTRO_ARTIFACTS, { recursive: true });
  testArgs.push('--debug-output', process.env.MAESTRO_ARTIFACTS, '--flatten-debug-output');
}
testArgs.push(flow);
const pressed = spawnSync('maestro', testArgs, { stdio: 'inherit' });
if (pressed.status !== 0) process.exit(pressed.status ?? 1);
