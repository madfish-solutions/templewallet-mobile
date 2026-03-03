import { exec } from 'child_process';

exec('yarn audit --level high', (error, stdout) => {
  if (error) {
    console.log(stdout);

    if (
      (stdout.includes('Axios is vulnerable to DoS attack through lack of data size') ||
        stdout.includes('minimatch')) &&
      !stdout.includes('Critical')
    ) {
      return;
    }

    if (stdout.includes('High') || stdout.includes('Critical')) {
      throw new Error('Audit failed');
    }
  }
});
