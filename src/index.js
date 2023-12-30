// -> configureStore is a function that helps create a store to keep track of the data for a React app.
// -> Provider is a component that makes it possible for all the components in the app to use the store.
// -> persistStore is a function that saves the store data even if the app is closed.
// -> persistReducer is a function that makes the store data persistable.
// -> FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, and REGISTER are action types that help manage the store data.
// -> storage is a module that helps save the store data in the browser's local storage.
// -> PersistGate is a component that delays the rendering of the app until the stored data is retrieved and ready to be used in the store.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import gameReducer from "./state";
import { configureStore } from "@reduxjs/toolkit"; // neccessary for persistStore
import { Provider } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // for local storage
import { PersistGate } from "redux-persist/integration/react";

const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, gameReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
  // </React.StrictMode>
);