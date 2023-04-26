import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from '@/plugins/axios';

const user = JSON.parse(sessionStorage.getItem('user')) || null;

const initialState = {
    user,
    isLogged: !!user,
    isAdmin: user ? user.roles.some(role => role.name === 'admin') : false,
    errors: []
};

export const login = createAsyncThunk(
    'auth/login',
    async (payload, thunkAPI) => {
        try {
            const { data } = await axios.post('/auth/login', payload);

            sessionStorage.setItem('user', JSON.stringify(data));

            toast.success('You have been logged in!');

            return data;
        } catch (err) {
            const serverErrors = err.response?.data?.errors;
            const errors = {};

            if (err.response?.status === 401) {
                toast.error('The email address or password is incorrect');
            }

            if (serverErrors) {
                serverErrors.forEach(error => {
                    errors[error.param] = error.msg;
                });
            }

            return thunkAPI.rejectWithValue(errors);
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        await axios.post('/auth/logout');

        sessionStorage.clear();
    } catch (err) {
        console.error(err);
    }
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers: builder =>
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLogged = true;
                state.isAdmin = action.payload.roles.some(
                    role => role.name === 'admin'
                );
                state.errors = [];
            })
            .addCase(login.rejected, (state, action) => {
                state.errors = action.payload;
            })
            .addCase(logout.fulfilled, state => {
                state.user = null;
                state.isLogged = false;
                state.isAdmin = false;
            })
});

export default authSlice.reducer;
