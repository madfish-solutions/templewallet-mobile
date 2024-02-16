import { exec } from 'child_process';

exec('yarn audit --level high', (error, stdout) => {
  if (error) {
    console.log(stdout);

    if (
      stdout.includes('1 High') &&
      stdout.includes('@react-native-community/cli-doctor > ip') &&
      stdout.includes('No patch available') &&
      !stdout.includes('Critical')
    ) {
      return;
    }

    if (stdout.includes('High') || stdout.includes('Critical')) {
      throw new Error('Audit failed');
    }
  }
});
