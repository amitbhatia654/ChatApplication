import { configureStore } from '@reduxjs/toolkit'
import { activeFolderReducer, socketReducer, userReducer } from './UserSlice'

const store = configureStore({
    reducer: {
        loginUser: userReducer,
        activeFolder: activeFolderReducer,
        user_socket: socketReducer

    }
})

export default store