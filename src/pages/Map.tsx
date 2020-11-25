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
import {MapNoCoordsSaved} from "../components/MapNoCoordsSaved";

const Map: React.FC = () => {
    const [map, setMap] = useState<mapboxgl.Map>();
    const mapContainerRef = useRef(null);

    const coordinatesSaved = useSelector(selectSavedCoordinates);

    useIonViewDidEnter(() => {
        if (mapContainerRef.current && coordinatesSaved && coordinatesSaved.length > 0) {
            const firstCoord = coordinatesSaved[0];

            const mapboxMap = new mapboxgl.Map({
                // @ts-ignore
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [firstCoord.lng, firstCoord.lat],
                zoom: 15
            });

            // add navigation control (the +/- zoom buttons)
            mapboxMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

            mapboxMap.on('load', function () {
                const coordinates = coordinatesSaved.map(coords => [coords.lng, coords.lat]);

                console.log(coordinates);

                mapboxMap.addSource('route', {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': coordinates
                        }
                    }
                });

                mapboxMap.addLayer({
                    'id': 'route',
                    'type': 'line',
                    'source': 'route',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '#888',
                        'line-width': 8
                    }
                });
            });

            setMap(mapboxMap);
        }
    }, [coordinatesSaved]);

    useIonViewWillLeave(() => {
        if (map) {
            map.remove();
            setMap(undefined);
        }
    }, [map]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Mapa</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {!coordinatesSaved ? <MapNoCoordsSaved/> : <div className="map-container" ref={mapContainerRef}/>}
            </IonContent>
        </IonPage>
    );
};

export default Map;
