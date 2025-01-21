//Redux slice for authentication:

import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null,
    },

    reducers: {
        login: (state, action) => {
            console.log('Login reducer:', action.payload);
            console.log('action.payload.user:', action.payload.user);
            console.log('action.payload.token:', action.payload.token);
            console.log('Login reducer:', action.payload);
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
        }
    }

})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;