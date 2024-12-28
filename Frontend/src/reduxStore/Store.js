import { configureStore } from '@reduxjs/toolkit'
import { activeFolderReducer, userReducer } from './UserSlice'

const store = configureStore({
    reducer: {
        loginUser: userReducer,
        activeFolder: activeFolderReducer
    }
})

export default store