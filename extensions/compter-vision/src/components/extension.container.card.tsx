/*
 * {{displayName}} — BlackVideo Extension
 * Author: {{author}}
 *
 * src/components/extension.container.card.tsx
 *
 * Main UI container injected into the ExtensionModalFrame.
 * This is the primary surface where your extension renders its content.
 *
 * Props passed by extension.modalFrame.ui.tsx:
 *   extId    — registry id ("computer-vision")
 *   manifest — full ExtensionManifest from registry (may be undefined while loading)
 */

import React, { useState, useEffect } from 'react';
import { VideoTheaterStage } from '../../../../../AppData/forbidden/dev/main/playground/Video.Theater.Stage';
import type { ExtensionManifest } from '../../../../../core/extension/extension.registry.server';
import Navigation from './ui/navigation';
import BottomSpace from './ui/bottomSpace';

interface ExtensionContainerCardProps {
  extId:    string;
  manifest?: ExtensionManifest;
}

const ExtensionContainerCard: React.FC<ExtensionContainerCardProps> = ({ extId, manifest }) => {
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

    // If video already loaded
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
      {/* ── Header ───────────────────────────────── */}
      <div className="ext-card-header">
        <span className="ext-card-title">{manifest?.displayName ?? extId}</span>
        <span className="ext-card-version">v{manifest?.version ?? '1.0.0'}</span>
      </div>

      {/* ── Main content ──────────────────────────── */}
      <div className="ext-card-body">
        {videoReady ? (
          <div className="ext-video-info">
            <span className="ext-label">Now Playing</span>
            <span className="ext-value ext-value--truncate">{videoSrc || 'Unknown source'}</span>
          </div>
        ) : (
          <div className="ext-idle-state">
            <span>Waiting for video to load…</span>
            <small>Play a video to activate this extension.</small>
          </div>
        )}

        {/*
          ─────────────────────────────────────────
          DEVELOPER: Add your extension content here
          ─────────────────────────────────────────
        */}
      </div>
    </div>
  );
};

export default ExtensionContainerCard;
