import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from '@/plugins/axios';

const initialState = {
    users: [],
    errors: [],
    isSuccess: false,
    page: 1,
    usersPerPage: 10,
    numberOfUsers: 0,
    countPages: null
};

export const index = createAsyncThunk(`/users`, async (page = 1) => {
    try {
        const { data } = await axios.get('/users', {
            params: { page, perPage: 10 }
        });

        return { data, page };
    } catch (err) {
        console.error(err);
    }
});

export const update = createAsyncThunk(
    '/user-update',
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`/users/${payload.id}`, payload);

            toast.success('USER HAS BEEN SAVED');

            return data;
        } catch (err) {
            const serverErrors = err.response?.data?.errors;
            const errors = {};

            if (serverErrors) {
                serverErrors.forEach(error => {
                    errors[error.param] = error.msg;
                });
            }

            return rejectWithValue(errors);
        }
    }
);

export const store = createAsyncThunk(
    '/user-add',
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/users', payload);

            toast.success('USER HAS BEEN SAVED');

            return data;
        } catch (err) {
            const serverErrors = err.response?.data?.errors;
            const errors = {};

            if (serverErrors) {
                serverErrors.forEach(error => {
                    errors[error.param] = error.msg;
                });
            }

            return rejectWithValue(errors);
        }
    }
);

export const destroy = createAsyncThunk('/user-delete', async payload => {
    try {
        await axios.delete(`/users/${payload}`);

        toast.success('USER HAS BEEN DELETED');

        return payload;
    } catch (err) {
        toast.error('SOMETHING WENT WRONG');
    }
});

export const searchQuery = createAsyncThunk(`/users-query`, async payload => {
    try {
        const {
            data: { rows }
        } = await axios.get(`/users?query=${payload}`);

        return rows;
    } catch (err) {
        console.error(err);
    }
});

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setPage(state, { payload }) {
            state.page = payload;
        },
        clearServerErrors(state) {
            state.errors = [];
        }
    },
    extraReducers: builder =>
        builder
            .addCase(index.fulfilled, (state, { payload: { data, page } }) => {
                state.users[page] = data.rows;
                state.errors = [];
                state.numberOfUsers = data.count;
                state.countPages = Math.ceil(data.count / state.usersPerPage);
            })
            .addCase(destroy.fulfilled, (state, { payload }) => {
                const { users, page } = state;

                const index = users[page].findIndex(
                    user => user.id === payload
                );

                users[page].splice(index, 1);
                users[page].push(users[page + 1][0]);
                users[page + 1].shift();
            })
            .addCase(store.fulfilled, (state, { payload }) => {
                const { users, page } = state;

                const user = state.users[state.page].pop();

                users[page + 1].unshift(user);
                users[page].unshift(payload);
                state.errors = [];
                state.isSuccess = true;
            })
            .addCase(store.rejected, (state, { payload }) => {
                state.errors = payload;
                state.isSuccess = false;
            })
            .addCase(update.fulfilled, (state, { payload }) => {
                const { users, page } = state;

                const index = users[page].findIndex(
                    user => user.id === payload.id
                );

                users[page].splice(index, 1, payload);
                state.errors = [];
                state.isSuccess = true;
            })
            .addCase(update.rejected, (state, { payload }) => {
                state.errors = payload;
                state.isSuccess = false;
            })
});

export const { clearServerErrors, setPage } = userSlice.actions;

export default userSlice.reducer;
