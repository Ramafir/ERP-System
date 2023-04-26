import axios from '@/plugins/axios';
import { toast } from 'react-toastify';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    contracts: [],
    errors: [],
    isSuccess: false,
    page: 1,
    contractsPerPage: 10,
    numberOfContracts: 0,
    countPages: null
};

export const index = createAsyncThunk('/contracts', async (page = 1) => {
    try {
        const { data } = await axios.get('/contracts', {
            params: { page, perPage: 10 }
        });

        return { data, page };
    } catch (err) {
        console.error(err);
    }
});

export const store = createAsyncThunk(
    '/contract-store',
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/contracts', payload);

            toast.success('CONTRACT HAS BEEN SAVED');

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

export const update = createAsyncThunk(
    '/contract-update',
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(
                `/contracts/${payload.id}`,
                payload
            );

            toast.success('CONTRACT HAS BEEN SAVED');

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

export const destroy = createAsyncThunk('/contract-delete', async payload => {
    try {
        await axios.delete(`/contracts/${payload.id}`);

        toast.success('CONTRACT HAS BEEN DELETED');

        return payload;
    } catch (err) {
        toast.error('SOMETHING WENT WRONG');
    }
});

export const contractSlice = createSlice({
    name: 'contract',
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
                state.contracts[page] = data.rows;
                state.errors = [];
                state.numberOfContracts = data.count;
                state.countPages = Math.ceil(
                    data.count / state.contractsPerPage
                );
            })
            .addCase(destroy.fulfilled, (state, { payload }) => {
                const { contracts, page } = state;

                const index = contracts[page].findIndex(
                    contract => contract.id === payload.id
                );

                contracts[page].splice(index, 1);
                contracts[page].push(contracts[page + 1][0]);
                contracts[page + 1].shift();
            })
            .addCase(store.fulfilled, (state, { payload }) => {
                const { contracts, page } = state;

                const contract = contracts[page].pop();

                contracts[page + 1].unshift(contract);
                contracts[page].unshift(payload);
                state.errors = [];
                state.isSuccess = true;
            })
            .addCase(store.rejected, (state, { payload }) => {
                state.errors = payload;
                state.isSuccess = false;
            })
            .addCase(update.fulfilled, (state, { payload }) => {
                const { contracts, page } = state;

                const index = contracts[page].findIndex(
                    contract => contract.id === payload.id
                );

                contracts[page].splice(index, 1, payload);
                state.errors = [];
                state.isSuccess = true;
            })
            .addCase(update.rejected, (state, { payload }) => {
                state.errors = payload;
                state.isSuccess = false;
            })
});

export const { clearServerErrors, setPage } = contractSlice.actions;

export default contractSlice.reducer;
