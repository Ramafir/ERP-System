import http from '../../plugins/axios';

export default {
    state: {
        vacations: [],
        vacationsToConfirm: []
    },
    getters: {
        getVacations: state => state.vacations,
        getVacationsToConfirm: state => state.vacationsToConfirm
    },
    mutations: {
        setVacations(state, { rows }) {
            state.vacations = rows;
        },

        setVacationsToConfirm(state, { rows }) {
            state.vacationsToConfirm = rows;
        },

        setVacation(state, vacation) {
            const vacationIndex = state.vacations.findIndex(
                v => v.id === vacation.id
            );

            if (~vacationIndex) {
                state.vacations.splice(vacationIndex, 1, vacation);
            }
        },

        addVacation(state, vacation) {
            state.vacations.unshift(vacation);
        },

        deleteVacation: (state, vacation) => {
            const vacationIndex = state.vacations.findIndex(
                v => v.id === vacation.id
            );

            state.vacations.splice(vacationIndex, 1);
        },

        deleteUnconfirmedVacation(state, vacation) {
            const vacationIndex = state.vacationsToConfirm.findIndex(
                v => v.id === vacation.id
            );

            state.vacationsToConfirm.splice(vacationIndex, 1);
        }
    },
    actions: {
        async fetchVacations({ commit }) {
            const { data } = await http.get('/vacations');

            commit('setVacations', data);

            return data;
        },

        async fetchUnconfirmedVacations({ commit }) {
            const { data } = await http.get('/vacations?confirm=false');

            commit('setVacationsToConfirm', data);

            return data;
        },

        async saveVacation({ commit }, vacation) {
            if (vacation.id) {
                const { data } = await http.put(
                    `/vacations/${vacation.id}`,
                    vacation
                );

                commit('setVacation', data);
                commit('users/setUser', data.user, { root: true });
            } else {
                const { data } = await http.post('/vacations', vacation);

                commit('addVacation', data);
                commit('setUser', data.user, { root: true });
            }
        },

        async deleteVacation({ commit }, vacation) {
            await http.delete(`/vacations/${vacation.id}`);

            commit('deleteVacation', vacation);
        },

        async confirmVacation({ commit }, id) {
            const { data } = await http.put(`/vacations/${id}/confirmed`);

            commit('setVacation', data);
            commit('deleteUnconfirmedVacation', data);
        }
    }
};
