export const conferenceNameDefault = 'loungemesh';

export const jitsiInitOptions = {
  disableAudioLevels: true,
  enableWindowOnErrorHandler: false,
};

export const conferenceOptions = {
  /**
   * Bridge channel to JVB. REQUIRED for the bridge to forward remote video:
   * the client signals receiver constraints (which sources it wants) over this
   * channel, otherwise modern JVB forwards audio only and remote tiles stay black.
   *
   * 'datachannel' runs the channel over the existing WebRTC SCTP connection, so
   * it needs no colibri-websocket, no Caddy proxy, and no public IP — it works
   * identically in local dev and production.
   */
  openBridgeChannel: 'datachannel' as const,
  /** Always use JVB — P2P breaks replaceTrack / remote media in LoungeMesh. */
  p2p: { enabled: false },
  /**
   * Simulcast gives the bridge several encodings to choose between. Without it
   * there is only one, so JVB has to push the *lowest* constraint any receiver
   * asked for back onto the sender — one participant on a small tile then
   * degrades the stream for everyone, and a screen share drops to tile
   * resolution. Keep it on so the bridge can drop layers per receiver instead.
   */
  disableSimulcast: false,
  /**
   * Cap on simultaneously forwarded video sources. 9 matches the classic Jitsi
   * deployment and keeps decode cost sane on a ~12 person team; screen shares
   * are budgeted on top of this in buildReceiverConstraints.
   */
  channelLastN: 9,
  /** Let the bridge stop sending higher layers for tiles nobody is looking at. */
  enableLayerSuspension: true,
  /**
   * AV1 and VP9 cost far less bandwidth than VP8 at the same resolution, which
   * matters most on constrained links where the bridge would otherwise suspend
   * streams outright. H264 stays last as the universal fallback.
   */
  videoQuality: {
    codecPreferenceOrder: ['AV1', 'VP9', 'VP8', 'H264'],
    mobileCodecPreferenceOrder: ['VP8', 'VP9', 'H264', 'AV1'],
  },
};

/**
 * Desktop capture constraints. A shared screen is mostly static text, so frame
 * rate buys very little while costing a lot of encode CPU and bitrate — the
 * classic Jitsi deployment caps it the same way.
 */
export const desktopSharingConstraints = {
  frameRate: { min: 5, max: 15 },
  maxHeight: 1080,
};
