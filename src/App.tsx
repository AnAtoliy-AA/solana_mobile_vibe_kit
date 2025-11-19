import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { wallet, card, list, swapHorizontal, rocketOutline } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Tab4 from './pages/Tab4';
import Launchpad from './pages/Launchpad';
import LaunchpadDetail from './pages/LaunchpadDetail';
import { SolanaProvider } from './context/SolanaContext';
import { PrivyProvider } from './context/PrivyContext';
import { QueryProvider } from './context/QueryContext';
import { useSettingsStore } from './lib/stores/useSettingsStore';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Custom themes */
import './styles/themes.css';

setupIonicReact();

// Theme initializer component
const ThemeInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
};

const App: React.FC = () => (
  <QueryProvider>
    <IonApp>
      <ThemeInitializer>
        <PrivyProvider>
          <SolanaProvider>
            <IonReactRouter basename={process.env.PUBLIC_URL || '/'}>
              <IonTabs>
                <IonRouterOutlet>
                  <Route exact path="/tab1">
                    <Tab1 />
                  </Route>
                  <Route exact path="/tab2">
                    <Tab2 />
                  </Route>
                  <Route path="/tab3">
                    <Tab3 />
                  </Route>
                  <Route path="/tab4">
                    <Tab4 />
                  </Route>
                  <Route exact path="/launchpad">
                    <Launchpad />
                  </Route>
                  <Route exact path="/launchpad/:id">
                    <LaunchpadDetail />
                  </Route>
                  <Route exact path="/">
                    <Redirect to="/launchpad" />
                  </Route>
                </IonRouterOutlet>
                <IonTabBar slot="bottom">
                  <IonTabButton tab="launchpad" href="/launchpad">
                    <IonIcon aria-hidden="true" icon={rocketOutline} />
                    <IonLabel>Launchpad</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="tab1" href="/tab1">
                    <IonIcon aria-hidden="true" icon={wallet} />
                    <IonLabel>Wallet</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="tab2" href="/tab2">
                    <IonIcon aria-hidden="true" icon={card} />
                    <IonLabel>Tokens</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="tab4" href="/tab4">
                    <IonIcon aria-hidden="true" icon={swapHorizontal} />
                    <IonLabel>Trade</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="tab3" href="/tab3">
                    <IonIcon aria-hidden="true" icon={list} />
                    <IonLabel>History</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              </IonTabs>
            </IonReactRouter>
          </SolanaProvider>
        </PrivyProvider>
      </ThemeInitializer>
    </IonApp>
  </QueryProvider>
);

export default App;
