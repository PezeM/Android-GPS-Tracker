import { Geolocation, GeolocationPosition } from "@capacitor/core";
import { IonButton, IonLoading, IonToast } from "@ionic/react"
import React, { useState } from "react"

interface LocationError {
    showError: boolean;
    message?: string;
}

export const GeolocationButton: React.FC = () => {
    const [loading, setIsLoading] = useState(false);
    const [position, setPosition] = useState<GeolocationPosition>();
    const [error, setError] = useState<LocationError>({showError: false});

    const getLocation = async () => {
        setIsLoading(true);
        try {
            const position = await Geolocation.getCurrentPosition();
            setIsLoading(false);
            setPosition(position);
            setError({
                showError: false,
                message: undefined
            });
        } catch (error) {
            const message = error.message.length  > 0 ? error.message : 'Nie można pobrać lokalizacji.';
            setError({showError: true, message});
            setIsLoading(false);
        }
    };

    return (
        <>
            <IonLoading isOpen={loading} message={"Pobieranie lokalizacji"} onDidDismiss={() => setIsLoading(false)} />
            <IonToast 
                isOpen={error.showError} 
                message={error.message}
                duration={3000} 
                onDidDismiss={() => setError({showError: false, message: undefined})} 
            />
            <IonButton expand="block" onClick={getLocation}>
                {position ? `${position.coords.latitude} ${position.coords.longitude}` : 'Pobierz pozycję'}
            </IonButton>
        </>
    )
}