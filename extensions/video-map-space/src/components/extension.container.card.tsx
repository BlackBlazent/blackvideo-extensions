/*
 * Video Map Space — BlackVideo Extension
 * src/components/extension.container.card.tsx
 *
 * Main UI container injected into extension.modalFrame.ui.tsx.
 * This is the primary surface for rendering your extension's UI.
 */

import React, { useState, useEffect } from 'react';
import { VideoTheaterStage } from '../../../../../../../AppData/forbidden/dev/main/playground/Video.Theater.Stage';

interface Props {
  extId:    string;
  manifest?: { id: string; displayName: string; version: string };
}

const ExtensionContainerCard: React.FC<Props> = ({ extId, manifest }) => {
  const [videoReady, setVideoReady] = useState(false);
  const [videoSrc,   setVideoSrc]   = useState<string>('');

  useEffect(() => {
    const stage = VideoTheaterStage.getInstance();
    const onLoad = (video: HTMLVideoElement | null) => {
      if (!video) return;
      setVideoReady(true);
      setVideoSrc(video.src);
    };
    stage.subscribe('loadedmetadata', onLoad);
    stage.subscribe('canplay', onLoad);
    const existing = stage.getVideoElement();
    if (existing && existing.readyState >= 2) {
      setVideoReady(true);
      setVideoSrc(existing.src);
    }
    return () => {
      stage.unsubscribe('loadedmetadata', onLoad);
      stage.unsubscribe('canplay', onLoad);
    };
  }, []);

  return (
    <div className="ext-container-card">
      <div className="ext-card-header">
        <span className="ext-card-title">{manifest?.displayName ?? extId}</span>
        <span className="ext-card-version">v{manifest?.version ?? '1.0.0'}</span>
      </div>

      <div className="ext-card-body">
        {videoReady
          ? <div className="ext-video-info">
              <span className="ext-label">Now Playing</span>
              <span className="ext-value ext-value--truncate">{videoSrc}</span>
            </div>
          : <div className="ext-idle-state">
              <span>Waiting for video…</span>
            </div>
        }
      </div>
    </div>
  );
};

export default ExtensionContainerCard;
