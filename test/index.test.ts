import { BaseUtils } from '../src/baseUtils';
import { Messages } from '../src/enums';
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

  describe('check getter / setter', () => {
    it('check default appId', () => {
      expect(baseUtils.appId).toBe('Winnum');
    });

    it('check appId after setting new value', () => {
      baseUtils.appId = 'iot';

      expect(baseUtils.appId).toBe('iot');
    });

    it('check for error if appId is not string', () => {
      expect.assertions(1);
      
      try {
        // @ts-ignore
        baseUtils.appId = 123
      } catch (e) {
        expect(e.message).toBe(Messages.appIdIsNotString);
      }
    });
  });
});
