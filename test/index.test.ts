import {BaseUtils} from '../src/baseUtils'
import {getDebugValue, mock} from './testUtils'

describe('baseUtils tests', () => {
  const baseUtils = new BaseUtils();
  Object.defineProperty(window, 'sessionStorage', { value: mock })

  describe('check sessionStorage debug', () => {
    it('storage to be undefined', () => {
      const sessionKey = getDebugValue();

      expect(sessionKey).toBeUndefined();
    });

    it('storage to be true', () => {
      baseUtils.setDebug();

      const sessionKey = getDebugValue();

      expect(sessionKey).toEqual('true');
    })
  })
})
