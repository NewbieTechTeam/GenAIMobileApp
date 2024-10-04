import React, { useEffect, useState } from 'react';
import { IonApp, IonRouterOutlet, IonAlert } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { NativeBiometric } from 'capacitor-native-biometric';

import OnboardingFlow from './components/OnboardingFlow';
import Home from './pages/Home';
import BiometricAuth from './components/BiometricAuth';

const App: React.FC = () => {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState<boolean>(true);
  const [requireBiometricAuth, setRequireBiometricAuth] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const checkBiometricTimeout = async () => {
      const { value } = await Preferences.get({ key: 'last_biometric_auth_time' });

      if (value) {
        const lastAuthTime = parseInt(value, 10);
        const currentTime = Date.now();

        // Check if 24 hours (86400000 milliseconds) have passed since last biometric auth
        if (currentTime - lastAuthTime > 86400000) {
          setRequireBiometricAuth(true);
        } else {
          setRequireBiometricAuth(false);
        }
      } else {
        setRequireBiometricAuth(true); // If no record found, require biometric auth
      }
    };

    const checkOnboardingStatus = async () => {
      const { value } = await Preferences.get({ key: 'onboarding_completed' });
      setShouldShowOnboarding(value !== 'true');  // Show onboarding if not completed
    };

    checkBiometricTimeout();
    checkOnboardingStatus();
  }, []);

  const performBiometricAuth = async () => {
    try {
      // Check if biometric auth is available
      const isAvailable = await NativeBiometric.isAvailable();
      if (isAvailable) {
        // Perform biometric authentication
        const result = await NativeBiometric.verifyIdentity({
          reason: 'Please authenticate to continue',
          title: 'Biometric Login',
          subtitle: 'Login with your biometric credentials',
        });

        if (result.success) {
          // Save the current time as the last authentication time
          const timestamp = Date.now().toString();
          await Preferences.set({ key: 'last_biometric_auth_time', value: timestamp });

          setRequireBiometricAuth(false); // Allow access after successful authentication
        }
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      setErrorMessage('Biometric authentication failed. Please try again or use an alternative method.');
      setShowErrorAlert(true); // Show error alert
    }
  };

  useEffect(() => {
    if (requireBiometricAuth) {
      performBiometricAuth();
    }
  }, [requireBiometricAuth]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Onboarding route */}
          <Route path="/onboarding" component={OnboardingFlow} exact />

          {/* Home route */}
          <Route path="/home" component={Home} exact />

          {/* Redirect logic */}
          {shouldShowOnboarding ? (
            <Redirect from="/" to="/onboarding" exact />
          ) : requireBiometricAuth ? (
            <Redirect from="/" to="/biometric-auth" exact />
          ) : (
            <Redirect from="/" to="/home" exact />
          )}
        </IonRouterOutlet>
        
        {/* Alert for biometric auth failure */}
        <IonAlert
          isOpen={showErrorAlert}
          onDidDismiss={() => setShowErrorAlert(false)}
          header={'Authentication Error'}
          message={errorMessage}
          buttons={[
            {
              text: 'OK',
              role: 'cancel',
              handler: () => {
                // Optionally, you can add logic here for alternative authentication methods
              },
            },
            {
              text: 'Use Alternative Method',
              handler: () => {
                // Navigate to an alternative authentication method if applicable
              },
            },
          ]}
        />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
