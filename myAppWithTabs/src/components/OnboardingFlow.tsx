import React, { useState } from 'react';
import { IonButton, IonContent, IonPage, IonText } from '@ionic/react';
import { Preferences } from '@capacitor/preferences';
import { useHistory } from 'react-router-dom';

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const history = useHistory();

  const completeOnboarding = async () => {
    await Preferences.set({ key: 'onboarding_completed', value: 'true' });
    history.push('/home');  // Redirect to home after completing onboarding
  };

  const slides = [
    {
      title: 'Welcome to the App!',
      description: 'Get started by following the onboarding process.',
    },
    {
      title: 'Secure Your Data',
      description: 'Use biometric authentication to keep your data safe.',
    },
    {
      title: 'Enjoy the Experience',
      description: 'Explore all the features after completing onboarding.',
    },
  ];

  const goToNextSlide = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      completeOnboarding();
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonText className="ion-padding">
          <h2>{slides[currentStep].title}</h2>
          <p>{slides[currentStep].description}</p>
        </IonText>
        <IonButton expand="block" onClick={goToNextSlide} className="ion-margin-top">
          {currentStep === slides.length - 1 ? 'Finish' : 'Next'}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default OnboardingFlow;
