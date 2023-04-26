import axios from '@/plugins/axios';
import { toast } from 'react-toastify';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    vacations: [],
    errors: [],
    isSuccess: false,
    page: 1,
    vacationsPerPage: 10,
    numberOfVacations: 0,
    countPages: null
};

export const index = createAsyncThunk(`/vacations`, async (page = 1) => {
    try {
        const { data } = await axios.get('/vacations', {
            params: { page, perPage: 10 }
        });

        return { data, page };
    } catch (err) {
        console.error(err);
    }
});

export const store = createAsyncThunk(
    `/vacations-store`,
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/vacations', payload);

            toast.success('VACATION HAS BEEN SAVED');

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
    `/vacations-update`,
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(
                `/vacations/${payload.id}`,
                payload
            );

            toast.success('VACATION HAS BEEN SAVED');

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

export const destroy = createAsyncThunk('/vacations-delete', async payload => {
    try {
        await axios.delete(`/vacations/${payload.id}`);

        toast.success('VACATION HAS BEEN DELETED');

        return payload;
    } catch (err) {
        toast.error('SOMETHING WENT WRONG');
    }
});

export const approve = createAsyncThunk('/vacations-confirm', async payload => {
    try {
        const { data } = await axios.put(`/vacations/${payload.id}/confirmed`);

        toast.success('VACATION HAS BEEN CONFIRMED');

        return data;
    } catch (err) {
        toast.error('SOMETHING WENT WRONG');
    }
});

export const vacationSlice = createSlice({
    name: 'vacation',
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
                state.vacations[page] = data.rows;
                state.errors = [];
                state.numberOfVacations = data.count;
                state.countPages = Math.ceil(
                    data.count / state.vacationsPerPage
                );
            })
            .addCase(destroy.fulfilled, (state, { payload }) => {
                const { vacations, page, countPages } = state;

                const index = vacations[page].findIndex(
                    vacation => vacation.id === payload.id
                );

                if (countPages > 1) {
                    vacations[page].splice(index, 1);
                    vacations[page].push(vacations[page + 1][0]);
                    vacations[page + 1].shift();
                } else {
                    vacations[page].splice(index, 1);
                }
            })
            .addCase(store.fulfilled, (state, { payload }) => {
                const { countPages, page, vacations } = state;

                if (countPages > 1) {
                    const vacation = vacations[page].pop();

                    vacations[page + 1].unshift(vacation);
                    vacations[page].unshift(payload);
                } else {
                    vacations[page].unshift(payload);
                }

                state.errors = [];
                state.isSuccess = true;
            })
            .addCase(store.rejected, (state, { payload }) => {
                state.errors = payload;
                state.isSuccess = false;
            })
            .addCase(update.fulfilled, (state, { payload }) => {
                const { vacations, page } = state;

                const index = vacations[page].findIndex(
                    vacation => vacation.id === payload.id
                );

                vacations[page].splice(index, 1, payload);
                state.errors = [];
                state.isSuccess = true;
            })
            .addCase(update.rejected, (state, { payload }) => {
                state.errors = payload;
                state.isSuccess = false;
            })
            .addCase(approve.fulfilled, (state, { payload }) => {
                const { vacations } = state;

                const index = vacations.findIndex(
                    vacation => vacation.id === payload.id
                );

                vacations.splice(index, 1, payload);
            })
});

export const { clearServerErrors, setPage } = vacationSlice.actions;

export default vacationSlice.reducer;
