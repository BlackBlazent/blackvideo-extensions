/*
 * {{displayName}} — BlackVideo Extension
 *
 * src/components/ui/navigation.tsx
 *
 * Optional top navigation bar rendered inside ExtensionModalFrame,
 * above the main container card.
 *
 * Remove the content or return null if your extension doesn't need a nav bar.
 */

import React from 'react';
import type { ExtensionManifest } from '../../../../../../core/extension/extension.registry.server';

interface NavigationProps {
  extId:     string;
  manifest?: ExtensionManifest;
}

const Navigation: React.FC<NavigationProps> = ({ extId, manifest }) => {
  // Return null if you don't need a navigation bar
  return null;

  /*
   * DEVELOPER: Uncomment and customize as needed.
   *
   * return (
   *   <nav className="ext-inner-nav">
   *     <button className="ext-nav-tab active">Overview</button>
   *     <button className="ext-nav-tab">Settings</button>
   *     <button className="ext-nav-tab">Logs</button>
   *   </nav>
   * );
   */
};

export default Navigation;
