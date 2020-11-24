import {IonCol, IonGrid, IonRow, IonText} from "@ionic/react";
import React from "react";

export const MapNoCoordsSaved: React.FC = () => {
    return (
        <IonGrid style={{"height": "100%"}}>
            <IonRow style={{"height": "100%"}} className="ion-align-items-center">
                <IonCol>
                    <IonText className="ion-text-center" color="danger">
                        <h3>Brak zapisanych punktów</h3>
                    </IonText>
                </IonCol>
            </IonRow>
        </IonGrid>
    )
}