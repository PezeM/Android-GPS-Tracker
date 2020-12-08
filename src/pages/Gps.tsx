import React, {useState} from 'react';
import {
    IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonPage,
    IonRow,  IonItem, IonLabel, IonList, IonText, IonAvatar, IonThumbnail, IonDatetime, IonSelect, IonSelectOption, IonToggle, IonInput, IonCheckbox, IonRange,IonListHeader,
    IonTitle, IonToast,
    IonToolbar, useIonViewDidEnter, useIonViewWillLeave
} from '@ionic/react';
import {locateOutline, stopCircleOutline, reloadOutline, locationOutline} from "ionicons/icons";
import { closeCircle, home, star, navigate, informationCircle, checkmarkCircle, shuffle } from 'ionicons/icons';
import {render} from '@testing-library/react';
import {useDispatch, useSelector} from "react-redux";
import {
    addGpsCoordinate,
    clearGpsCoordinates,
    selectIsTrackingStarted,
    selectSavedCoordinates,
    setTrackingState
} from "../reducers/gpsSlice";
import {Geolocation} from "@capacitor/core";

interface LocationError {
    showError: boolean;
    message?: string;
}

const Gps: React.FC = () => {
    const [geolocationInterval, setGeolocationInterval] = useState<NodeJS.Timeout | undefined>(undefined);
    const [error, setError] = useState<LocationError>({showError: false});

    const coordinatesSaved = useSelector(selectSavedCoordinates);
    const isTrackingSelected = useSelector(selectIsTrackingStarted);
    const dispatch = useDispatch();

    useIonViewDidEnter(async () => {
        if (isTrackingSelected && !geolocationInterval) {
            await startGettingLocation();
        }
    }, [isTrackingSelected, geolocationInterval]);

    useIonViewWillLeave(() => {
        if (geolocationInterval) {
            clearInterval(geolocationInterval);
            setGeolocationInterval(undefined);
        }
    }, [geolocationInterval]);

    async function startGettingLocation() {
        if (await getCurrentLocation()) {
            dispatch(setTrackingState(true));
            setGeolocationInterval(setInterval(getCurrentLocation, 1000));
        }
    }

    async function getCurrentLocation(): Promise<boolean> {
        try {
            const currentLocation = await Geolocation.getCurrentPosition();
            setError({
                showError: false,
                message: undefined
            });

            dispatch(addGpsCoordinate({
                lat: currentLocation.coords.latitude,
                lng: currentLocation.coords.longitude
            }));

            return true;
        } catch (e) {
            const message = e.message.length > 0 ? e.message : 'Nie można pobrać lokalizacji.';
            setError({showError: true, message});
            return false;
        }
    }

    function restartGettingLocation() {
        dispatch(clearGpsCoordinates({}));
    }

    function stopGettingLocation() {
        dispatch(setTrackingState(false));

        if (geolocationInterval) {
            clearInterval(geolocationInterval);
            setGeolocationInterval(undefined);
        }
    }

    function showCoordinates() {
        if (!coordinatesSaved) {
            return (
                <div>
                    <IonRow>Naciśnij start aby rozpocząć!</IonRow>
                </div>
            );
        } else
            {

            const listItems = coordinatesSaved.map((coordinate) =>
                <IonItem >Szerokość: {coordinate.lat.toFixed(1)}°, Długość: {coordinate.lng.toFixed(1)}° <IonIcon icon={locationOutline} slot="end" /> </IonItem >
            );

            return (
                        <IonList>{listItems}</IonList>
            );
        }
    }


    return (
        <IonPage>
            <IonToast
                isOpen={error.showError}
                message={error.message}
                duration={3000}
                onDidDismiss={() => setError({showError: false, message: undefined})}
            />

            <IonHeader>
                <IonToolbar>
                    <IonTitle>Lokalizacja</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen={true}>
                <IonGrid style={{"height": "100%"}}>
                    <IonRow>
                        <IonCol className="ion-text-center">
                            <IonButton expand={"block"} onClick={startGettingLocation}
                                       disabled={isTrackingSelected}>
                                <IonIcon slot="start" icon={locateOutline}/>
                                Start
                            </IonButton>
                        </IonCol>
                        <IonCol className="ion-text-center">
                            <IonButton color={"danger"} expand={"block"} onClick={restartGettingLocation}
                                       disabled={!isTrackingSelected}>
                                <IonIcon slot="start" icon={reloadOutline}/>
                                Restart
                            </IonButton>
                        </IonCol>
                        <IonCol className="ion-text-center">
                            <IonButton color={"danger"} expand={"block"} onClick={stopGettingLocation}
                                       disabled={!isTrackingSelected}>
                                <IonIcon slot="start" icon={stopCircleOutline}/>
                                Stop
                            </IonButton>
                        </IonCol>
                    </IonRow>
                    <IonList>
                        <IonItem lines="none" color="warning">
                           <b> <IonLabel>Lista koordynatów:</IonLabel></b>
                        </IonItem>
                        <IonItem lines="none">
                                <IonLabel>
                                    <IonText >
                                        {
                                            showCoordinates()
                                        }
                                    </IonText>
                                </IonLabel>
                            </IonItem>
                    </IonList>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Gps;
