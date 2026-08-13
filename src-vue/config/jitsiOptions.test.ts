import { describe, expect, it } from 'vitest';
import {
  conferenceNameDefault,
  conferenceOptions,
  desktopSharingConstraints,
  jitsiInitOptions,
} from './jitsiOptions';

describe('jitsiOptions', () => {
  it('exports loungemesh defaults', () => {
    expect(conferenceNameDefault).toBe('loungemesh');
    expect(conferenceOptions.channelLastN).toBe(9);
    expect(conferenceOptions.openBridgeChannel).toBe('datachannel');
    expect(conferenceOptions.p2p).toEqual({ enabled: false });
    expect(jitsiInitOptions.disableAudioLevels).toBe(true);
    expect(jitsiInitOptions.enableWindowOnErrorHandler).toBe(false);
  });

  it('keeps simulcast on so the bridge degrades per receiver, not per sender', () => {
    // With a single encoding JVB pushes the lowest receiver constraint back onto
    // the sender, so one small tile drags the stream down for everyone.
    expect(conferenceOptions.disableSimulcast).toBe(false);
    expect(conferenceOptions.enableLayerSuspension).toBe(true);
  });

  it('caps desktop capture so a shared 4K screen cannot saturate the encoder', () => {
    expect(desktopSharingConstraints.frameRate).toEqual({ min: 5, max: 15 });
    expect(desktopSharingConstraints.maxHeight).toBe(1080);
  });
});
