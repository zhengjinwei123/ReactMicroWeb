import { createStore } from "redux";
import rootReducer from "../reducers/index.js"

import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";

const storageConfig = {
    key: "root",
    storage: storageSession,
    blacklist: []
}


// export default function configureStore(initialState) {
//
//
//
//     const store = createStore(rootReducer, initialState,
//         window.devToolsExtention ? window.devToolsExtention() : undefined)
//     return store
// }

const myPersistReducer = persistReducer(storageConfig, rootReducer)
const store = createStore(myPersistReducer)

export default store
export const persistor = persistStore(store)