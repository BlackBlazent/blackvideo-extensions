/*
 * {{displayName}} — BlackVideo Extension
 *
 * src/components/ui/bottomSpace.tsx
 *
 * Optional bottom bar rendered inside ExtensionModalFrame,
 * below the main container card and above the default copyright footer.
 *
 * Return null if your extension has no status bar or action bar.
 */

import React from 'react';
import type { ExtensionManifest } from '../../../../../../core/extension/extension.registry.server';

interface BottomSpaceProps {
  extId:     string;
  manifest?: ExtensionManifest;
}

const BottomSpace: React.FC<BottomSpaceProps> = ({ extId, manifest }) => {
  // Return null if you don't need a bottom bar
  return null;

  /*
   * DEVELOPER: Uncomment and customize as needed.
   *
   * return (
   *   <div className="ext-bottom-bar">
   *     <span className="ext-status-dot ext-status-dot--ok" />
   *     <span>Ready</span>
   *   </div>
   * );
   */
};

export default BottomSpace;
