import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {defineCustomElements} from '@ionic/pwa-elements/loader';
import {store} from "./store";
import {Provider} from 'react-redux';
import mapboxgl from 'mapbox-gl';
import {Config} from "./config";

mapboxgl.accessToken = Config.MAPBOX_ACCESS_TOKEN;

defineCustomElements(window);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
