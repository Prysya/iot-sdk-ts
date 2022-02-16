import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
    testEnvironment: 'jsdom',
    preset: 'ts-jest',
    testURL: 'https://test.com',
    moduleDirectories: ['node_modules', 'src']
  };
};
