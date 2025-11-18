// Global Settings Button Component

import React, { useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { settingsOutline } from 'ionicons/icons';
import SettingsModal from './SettingsModal';

interface GlobalSettingsButtonProps {
  slot?: 'start' | 'end';
  className?: string;
}

const GlobalSettingsButton: React.FC<GlobalSettingsButtonProps> = ({ slot = 'end', className }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <IonButton
        onClick={() => setIsSettingsOpen(true)}
        fill="clear"
        slot={slot}
        className={className}
      >
        <IonIcon icon={settingsOutline} slot="icon-only" />
      </IonButton>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default GlobalSettingsButton;
