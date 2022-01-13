import { BaseUtils } from '../src/baseUtils';
import { getDebugValue, mock } from './testUtils';

describe('baseUtils tests', () => {
  const baseUtils = new BaseUtils();
  Object.defineProperty(window, 'sessionStorage', { value: mock });

  describe('check sessionStorage debug', () => {
    it('storage to be undefined', () => {
      const sessionKey = getDebugValue();

      expect(sessionKey).toBeUndefined();
    });

    it('storage to be true', () => {
      baseUtils.setDebug();

      const sessionKey = getDebugValue();

      expect(sessionKey).toBe('true');
    });
  });

  describe('check AppId getter', () => {
    it('appId should be "iot" by default', () => {
      expect(baseUtils.getAppId()).toBe('iot');
    });

    it('appId should be "Winnum"', () => {
      window.history.pushState({}, 'winnum', '/Winnum/');

      expect(baseUtils.getAppId()).toBe('Winnum');
    })
  });
});
