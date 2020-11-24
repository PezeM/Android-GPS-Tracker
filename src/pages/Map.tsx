import React, {useRef, useState} from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar, useIonViewDidEnter, useIonViewWillLeave
} from '@ionic/react';
import {useSelector} from "react-redux";
import {selectSavedCoordinates} from "../reducers/gpsSlice";
import mapboxgl from "mapbox-gl";
import './Map.css';

const Map: React.FC = () => {
    const [map, setMap] = useState<mapboxgl.Map>();
    const mapContainerRef = useRef(null);

    const coordinatesSaved = useSelector(selectSavedCoordinates);

    useIonViewDidEnter(() => {
        if (mapContainerRef && mapContainerRef.current) {
            const mapboxMap = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [-104.9876, 39.7405],
                zoom: 12.5,
            });

            // add navigation control (the +/- zoom buttons)
            mapboxMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

            setMap(mapboxMap);
        }

        console.log(mapContainerRef);
    });

    useIonViewWillLeave(() => {
        console.log(mapContainerRef, map);

        if (map) {
            map.remove();
            setMap(undefined);
        }
    }, [map]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Photo Gallery</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {!coordinatesSaved ? 'Nie ma kordynatow' : <div className="map-container" ref={mapContainerRef}/>}
            </IonContent>
        </IonPage>
    );
};

export default Map;
