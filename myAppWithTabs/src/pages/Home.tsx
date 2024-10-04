import React from 'react';
import { IonPage, IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { Preferences } from '@capacitor/preferences';
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const history = useHistory();

  const logout = async () => {
    // Clear onboarding status and redirect to onboarding screen
    await Preferences.remove({ key: 'onboarding_completed' });
    history.push('/onboarding');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <h2>Welcome to the Home Page</h2>
        <p>This is the main screen of your app.</p>
        <IonButton expand="block" onClick={logout}>
          Logout and Reset Onboarding
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
