import React from "react"
import RouterMap from "./routers/routerMap.jsx";
import configureStore, {persistor} from "./store/index.js";
import { Provider  } from "react-redux";
import { PersistGate } from 'redux-persist/lib/integration/react';

const AppFrameWork = (props) => {

    const {content, loading } = props
    return (
        <Provider store={configureStore}>
            <div id="zjw-loging-container"></div>
            <PersistGate loading={null} persistor={persistor}>
                <RouterMap loading={loading} content={content}/>
            </PersistGate>
        </Provider>
    )
}

export default AppFrameWork