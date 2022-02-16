import { DebugUtils } from './debugUtils';

describe('Check debug', () => {
  it('Storage should be undefined', () => {
    const sessionKey = DebugUtils.checkDebug();

    expect(sessionKey).toBeFalsy();
  });

  it('Storage should be true', () => {
    DebugUtils.setDebug();

    const sessionKey = DebugUtils.checkDebug();

    expect(sessionKey).toBeTruthy();
  });
});
