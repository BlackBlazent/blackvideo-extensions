/*
 * Video Map Space
 * src/components/ui/bottomSpace.tsx
 *
 * Optional status bar rendered below the container card.
 * Return null if not needed.
 */

import React from 'react';

interface BottomSpaceProps {
  extId:     string;
  manifest?: { id: string };
}

const BottomSpace: React.FC<BottomSpaceProps> = (_props) => {
  return null;

  /*
  return (
    <div className="ext-bottom-bar">
      <span className="ext-status-dot ext-status-dot--ok" />
      <span>Ready</span>
    </div>
  );
  */
};

export default BottomSpace;
