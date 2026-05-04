import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice'
import requestReducer from './requestSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    request: requestReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['request.current.personal.idCardFileObj'],
        ignoredActions: ['request/personal'],
      },
    }),
})

export default store