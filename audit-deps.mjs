import { exec } from 'child_process';

exec('yarn audit --level high', (error, stdout) => {
  if (error) {
    console.log(stdout);

    if (stdout.includes('High') || stdout.includes('Critical')) {
      throw new Error('Audit failed');
    }
  }
});
