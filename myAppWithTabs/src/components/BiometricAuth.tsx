import React, { useEffect } from 'react';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Preferences } from '@capacitor/preferences';

const BiometricAuth: React.FC = () => {
  useEffect(() => {
    const performBiometricAuth = async () => {
      try {
        const result = await NativeBiometric.verifyIdentity({
          reason: 'Please authenticate to continue',
          title: 'Biometric Login',
          subtitle: 'Login with your biometric credentials',
        });

        if (result.success) {
          // Save the current time as the last biometric authentication time
          const timestamp = Date.now().toString();
          await Preferences.set({ key: 'last_biometric_auth_time', value: timestamp });

          // Redirect to home after successful authentication
          window.location.href = '/home';
        } else {
          console.log('Biometric authentication failed.');
        }
      } catch (error) {
        console.error('Biometric authentication error:', error);
      }
    };

    performBiometricAuth();
  }, []);

  return (
    <div>
      <h1>Biometric Authentication Required</h1>
      <p>Please authenticate using your biometric credentials to proceed.</p>
    </div>
  );
};

export default BiometricAuth;
