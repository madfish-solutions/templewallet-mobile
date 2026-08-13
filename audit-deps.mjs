import { exec } from 'child_process';

const ignoredAdvisories = new Map([
  ['GHSA-w3rx-r6r6-pgpr', 'ICNS parser allows denial of service through an infinite loop'],
  ['GHSA-5p2g-fcmc-qvqq', 'JXL and HEIF parsers allow denial of service through infinite loops']
]);

const formatAdvisory = advisory => {
  const details = Object.entries(advisory.children).map(([name, value]) => {
    const formattedValue = Array.isArray(value) ? value.join(', ') : value;

    return `  ${name}: ${formattedValue}`;
  });

  return [advisory.value, ...details].join('\n');
};

exec('yarn npm audit --recursive --severity high --json', (error, stdout, stderr) => {
  const advisories = stdout
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));

  const vulnerabilities = advisories.filter(advisory => {
    const advisoryId = advisory.children.URL.split('/').pop();
    const ignoreReason = ignoredAdvisories.get(advisoryId);

    if (!ignoreReason) {
      return true;
    }

    const versions = advisory.children['Tree Versions'];
    const onlyLegacyVersions = versions.every(version => /^[12]\./.test(version));

    if (!onlyLegacyVersions) {
      return true;
    }

    console.warn(`Ignoring ${advisoryId}: ${ignoreReason}`);

    return false;
  });

  if (vulnerabilities.length > 0) {
    console.error(vulnerabilities.map(formatAdvisory).join('\n\n'));
    throw new Error(`Audit failed with ${vulnerabilities.length} vulnerabilities`);
  }

  if (error && !stdout.trim()) {
    console.error(stderr);
    throw error;
  }
});
