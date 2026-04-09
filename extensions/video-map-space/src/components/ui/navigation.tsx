/*
 * Video Map Space
 * src/components/ui/navigation.tsx
 *
 * Optional inner nav bar rendered above the container card.
 * Return null if not needed.
 */

import React from 'react';

interface NavigationProps {
  extId:     string;
  manifest?: { id: string };
}

const Navigation: React.FC<NavigationProps> = (_props) => {
  // Return null to hide, or add tab buttons:
  return null;

  /*
  return (
    <nav className="ext-inner-nav">
      <button className="ext-nav-tab active">Overview</button>
      <button className="ext-nav-tab">Settings</button>
    </nav>
  );
  */
};

export default Navigation;
