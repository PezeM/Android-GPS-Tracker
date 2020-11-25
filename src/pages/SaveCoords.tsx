import React, {useState} from 'react';
import {
    IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonLoading,
    IonPage,
    IonRow,
    IonText,
    IonTitle,
    IonToast,
    IonToolbar
} from '@ionic/react';
import {useSelector} from "react-redux";
import {selectSavedCoordinates} from "../reducers/gpsSlice";
import {cloudUploadOutline} from "ionicons/icons";
import {useFilesystem} from "@ionic/react-hooks/filesystem";
import {FilesystemDirectory} from "@capacitor/core";

interface SaveFileResult {
    showToast: boolean;
    message?: string;
}

const SaveCoords: React.FC = () => {
    const [saveFileLoader, setSaveFileLoader] = useState(false);
    const [saveFileResult, setSaveFileResult] = useState<SaveFileResult>({showToast: false});
    const coordinatesSaved = useSelector(selectSavedCoordinates);
    const {writeFile} = useFilesystem();

    async function save() {
        if (!coordinatesSaved) return;

        try {
            setSaveFileLoader(true);
            const data = btoa(JSON.stringify(coordinatesSaved));
            const fileName = `coords-${new Date().toLocaleTimeString()}.json`;
            const result = await writeFile({
                path: fileName,
                data: data,
                recursive: true,
                directory: FilesystemDirectory.Documents
            });

            setSaveFileLoader(false);
            setSaveFileResult({showToast: true, message: `Pomyślnie zapisano ${coordinatesSaved.length} koordynatów.`});
            console.log(`Wrote file ${result.uri}`,);
        } catch (e) {
            setSaveFileResult({showToast: true, message: e.toString()});
            console.error('Unable to write file', e);
            setSaveFileLoader(false);
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Zapisz koordynaty</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading
                    isOpen={saveFileLoader}
                    onDidDismiss={() => setSaveFileLoader(false)}
                    message={'Zapisywanie pliku'}
                />
                <IonToast
                    isOpen={saveFileResult.showToast}
                    message={saveFileResult.message}
                    duration={3000}
                    onDidDismiss={() => setSaveFileResult({showToast: false, message: undefined})}
                    position={"top"}
                />
                <IonGrid style={{"height": "100%"}}>
                    <IonRow style={{"height": "100%"}} className="ion-align-items-center">
                        <IonCol>
                            {coordinatesSaved
                                ? <IonButton expand="block" onClick={save}>
                                    <IonIcon slot="start" icon={cloudUploadOutline}/>
                                    Zapisz koordynaty
                                </IonButton>
                                : <IonText className="ion-text-center" color="danger">
                                    <h3>Brak zapisanych punktów</h3>
                                </IonText>
                            }
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default SaveCoords;
