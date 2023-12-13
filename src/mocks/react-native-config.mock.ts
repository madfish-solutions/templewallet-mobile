import mockDotEnv from 'dotenv';
import mockFs from 'fs';
import mockPath from 'path';

// See: https://github.com/lugg/react-native-config?tab=readme-ov-file#testing
jest.mock('react-native-config', () => {
  const envFile = mockFs.readFileSync(mockPath.resolve(process.cwd(), '.env.dist'), 'utf-8');

  return mockDotEnv.parse(envFile);
});
