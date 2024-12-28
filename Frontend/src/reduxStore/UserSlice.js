import { createSlice } from "@reduxjs/toolkit";

const getUserFromLocalStorage = () => JSON.parse(localStorage.getItem("user")) || {};

const userSlice = createSlice({
    name: "userDetails",
    initialState: getUserFromLocalStorage(),
    reducers: {
        add(state, action) {
            return action.payload;
        },
        remove() {
            return {};
        },
    },
});

const activeFolderSlice = createSlice({
    name: "activeFolder",
    initialState: {},
    reducers: {
        addFolder(state, action) {
            return action.payload;
        },
        removeFolder() {
            return {};
        },
    },
});

export const { add: addUser, remove: removeUser } = userSlice.actions;
export const { addFolder, removeFolder } = activeFolderSlice.actions;

export const userReducer = userSlice.reducer;
export const activeFolderReducer = activeFolderSlice.reducer;
