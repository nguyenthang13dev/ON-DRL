import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'

// Tạo một storage động dựa trên môi trường
let reduxStorage

if (typeof window !== 'undefined') {
  // Client-side: sử dụng localStorage
  const storage = require('redux-persist/lib/storage').default
  reduxStorage = storage
} else {
  // Server-side: tạo một storage giả không thực hiện gì cả
  reduxStorage = {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  }
}

import counterReducer from './counter/counterSlice'
import CustomizerReducer from './customizer/CustomizerSlice'
import authReducer from './auth/AuthSlice'
import generalReducer from './general/GeneralSlice'
import menuReducer from './menu/MenuSlice'
import permissionReducer from './auth/PermissionSlice'

const customizerPersistConfig = {
  key: 'customizer',
  storage: reduxStorage
};

const menuPersistConfig = {
  key: 'menu',
  storage: reduxStorage
};

const authPersistConfig = {
  key: 'auth',
  storage: reduxStorage
};

const permissionPersistConfig = {
  key: 'permission',
  storage: reduxStorage
};

const persistedCustomizerReducer = persistReducer<any>(customizerPersistConfig, CustomizerReducer)
const persistedMenuReducer = persistReducer<any>(menuPersistConfig, menuReducer);
const persistedAuthReducer = persistReducer<any>(authPersistConfig, authReducer);
const persistedPermissionReducer = persistReducer<any>(permissionPersistConfig, permissionReducer);

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    customizer: persistedCustomizerReducer,
    auth: persistedAuthReducer,
    general: generalReducer,
    menu: persistedMenuReducer,
    permission: persistedPermissionReducer
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
        immutableCheck: false
      }),
})

const rootReducer = combineReducers({
  counter: counterReducer,
  customizer: CustomizerReducer,
  auth: authReducer,
  general: generalReducer,
  menu: menuReducer,
  permission: permissionReducer
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof rootReducer>

