import { exec } from 'child_process';

exec('yarn npm audit --recursive --severity high', (error, stdout) => {
  if (error) {
    console.log(stdout);

    if (stdout.includes('minimatch') && !stdout.includes('critical')) {
      return;
    }

    if (stdout.includes('high') || stdout.includes('critical')) {
      throw new Error('Audit failed');
    }
  }
});
