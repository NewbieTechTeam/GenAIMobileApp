import { Camera, CameraResultType } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';
import React, { useEffect, useState } from 'react';
import { IonButton, IonContent, IonPage } from '@ionic/react';

const FaceRecognition: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);

  // Capture user's face
  const captureFace = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      quality: 90,
    });
    const base64Image = `data:image/jpeg;base64,${photo.base64String}`;
    setImage(base64Image);

    // Store last face authentication time
    const timestamp = Date.now().toString();
    await Preferences.set({ key: 'last_face_auth_time', value: timestamp });

    console.log('Captured face image and stored timestamp.');
  };

  return (
    <IonPage>
      <IonContent>
        <p>Capture your face for recognition:</p>
        <IonButton onClick={captureFace}>Capture Face</IonButton>
        {image && <img src={image} alt="Captured face" />}
      </IonContent>
    </IonPage>
  );
};

export default FaceRecognition;
