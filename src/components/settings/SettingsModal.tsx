// Settings Modal Component

import React from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonButtons,
  IonIcon,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import { useSettingsStore, Language, Theme } from '../../lib/stores/useSettingsStore';
import { useTranslation } from '../../lib/i18n/useTranslation';
import './SettingsModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const t = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const theme = useSettingsStore((state) => state.theme);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const setTheme = useSettingsStore((state) => state.setTheme);

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
  };

  const handleThemeChange = (value: Theme) => {
    setTheme(value);
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="settings-modal">
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t.settingsTitle}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel position="stacked">{t.languageLabel}</IonLabel>
            <IonSelect
              value={language}
              onIonChange={(e) => handleLanguageChange(e.detail.value as Language)}
              interface="popover"
            >
              <IonSelectOption value="en">{t.english}</IonSelectOption>
              <IonSelectOption value="de">{t.german}</IonSelectOption>
              <IonSelectOption value="fr">{t.french}</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">{t.themeLabel}</IonLabel>
            <IonSelect
              value={theme}
              onIonChange={(e) => handleThemeChange(e.detail.value as Theme)}
              interface="popover"
            >
              <IonSelectOption value="default">
                <div className="theme-option">
                  <span className="theme-preview theme-preview-default"></span>
                  {t.defaultTheme}
                </div>
              </IonSelectOption>
              <IonSelectOption value="dark">
                <div className="theme-option">
                  <span className="theme-preview theme-preview-dark"></span>
                  {t.darkTheme}
                </div>
              </IonSelectOption>
              <IonSelectOption value="ocean">
                <div className="theme-option">
                  <span className="theme-preview theme-preview-ocean"></span>
                  {t.oceanTheme}
                </div>
              </IonSelectOption>
              <IonSelectOption value="sunset">
                <div className="theme-option">
                  <span className="theme-preview theme-preview-sunset"></span>
                  {t.sunsetTheme}
                </div>
              </IonSelectOption>
              <IonSelectOption value="neon-cyan">
                <div className="theme-option">
                  <span className="theme-preview theme-preview-neon-cyan"></span>
                  {t.neonCyanTheme}
                </div>
              </IonSelectOption>
              <IonSelectOption value="neon-purple">
                <div className="theme-option">
                  <span className="theme-preview theme-preview-neon-purple"></span>
                  {t.neonPurpleTheme}
                </div>
              </IonSelectOption>
              <IonSelectOption value="neon-green">
                <div className="theme-option">
                  <span className="theme-preview theme-preview-neon-green"></span>
                  {t.neonGreenTheme}
                </div>
              </IonSelectOption>
              <IonSelectOption value="neon-pink">
                <div className="theme-option">
                  <span className="theme-preview theme-preview-neon-pink"></span>
                  {t.neonPinkTheme}
                </div>
              </IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>

        <div className="settings-preview">
          <h3>{t.themeLabel}</h3>
          <div className="theme-preview-cards">
            <div
              className={`theme-card ${theme === 'default' ? 'active' : ''}`}
              onClick={() => handleThemeChange('default')}
            >
              <div className="theme-card-colors">
                <span style={{ background: '#3880ff' }}></span>
                <span style={{ background: '#0cd1e8' }}></span>
                <span style={{ background: '#ffffff' }}></span>
              </div>
              <p>{t.defaultTheme}</p>
            </div>
            <div
              className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              <div className="theme-card-colors">
                <span style={{ background: '#4a90e2' }}></span>
                <span style={{ background: '#50e3c2' }}></span>
                <span style={{ background: '#1a1d23' }}></span>
              </div>
              <p>{t.darkTheme}</p>
            </div>
            <div
              className={`theme-card ${theme === 'ocean' ? 'active' : ''}`}
              onClick={() => handleThemeChange('ocean')}
            >
              <div className="theme-card-colors">
                <span style={{ background: '#00b4d8' }}></span>
                <span style={{ background: '#48cae4' }}></span>
                <span style={{ background: '#e8f4f8' }}></span>
              </div>
              <p>{t.oceanTheme}</p>
            </div>
            <div
              className={`theme-card ${theme === 'sunset' ? 'active' : ''}`}
              onClick={() => handleThemeChange('sunset')}
            >
              <div className="theme-card-colors">
                <span style={{ background: '#ff6b6b' }}></span>
                <span style={{ background: '#feca57' }}></span>
                <span style={{ background: '#fff5f0' }}></span>
              </div>
              <p>{t.sunsetTheme}</p>
            </div>
            <div
              className={`theme-card ${theme === 'neon-cyan' ? 'active' : ''}`}
              onClick={() => handleThemeChange('neon-cyan')}
            >
              <div className="theme-card-colors">
                <span style={{ background: '#00ffff' }}></span>
                <span style={{ background: '#00ffcc' }}></span>
                <span style={{ background: '#00ccff' }}></span>
              </div>
              <p>{t.neonCyanTheme}</p>
            </div>
            <div
              className={`theme-card ${theme === 'neon-purple' ? 'active' : ''}`}
              onClick={() => handleThemeChange('neon-purple')}
            >
              <div className="theme-card-colors">
                <span style={{ background: '#7b00ff' }}></span>
                <span style={{ background: '#ff00ff' }}></span>
                <span style={{ background: '#9d00ff' }}></span>
              </div>
              <p>{t.neonPurpleTheme}</p>
            </div>
            <div
              className={`theme-card ${theme === 'neon-green' ? 'active' : ''}`}
              onClick={() => handleThemeChange('neon-green')}
            >
              <div className="theme-card-colors">
                <span style={{ background: '#00ff88' }}></span>
                <span style={{ background: '#39ff14' }}></span>
                <span style={{ background: '#00ff41' }}></span>
              </div>
              <p>{t.neonGreenTheme}</p>
            </div>
            <div
              className={`theme-card ${theme === 'neon-pink' ? 'active' : ''}`}
              onClick={() => handleThemeChange('neon-pink')}
            >
              <div className="theme-card-colors">
                <span style={{ background: '#ff0080' }}></span>
                <span style={{ background: '#ff00ff' }}></span>
                <span style={{ background: '#ff1493' }}></span>
              </div>
              <p>{t.neonPinkTheme}</p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default SettingsModal;
