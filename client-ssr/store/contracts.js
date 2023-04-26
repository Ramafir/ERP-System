export const state = () => ({ contracts: [] });

export const getters = {
    getContracts: state => state.contracts
};

export const mutations = {
    setContracts(state, { rows }) {
        state.contracts = rows;
    },

    setContract: (state, contract) => {
        const contractIndex = state.contracts.findIndex(
            c => c.id === contract.id
        );

        if (~contractIndex) {
            state.contracts.splice(contractIndex, 1, contract);
        }
    },

    addContract(state, data) {
        state.contracts.unshift(data);
    },

    deleteContract(state, contract) {
        const contractIndex = state.contracts.findIndex(
            c => c.id === contract.id
        );

        state.contracts.splice(contractIndex, 1);
    }
};

export const actions = {
    async fetchContracts({ commit }) {
        const data = await this.$axios.$get('/contracts');

        commit('setContracts', data);

        return data;
    },

    async saveContract({ commit }, contract) {
        if (contract.id) {
            const { data } = await this.$axios.put(
                `/contracts/${contract.id}`,
                contract
            );

            commit('setContract', data);
            commit('users/setUser', data.user, { root: true });
        } else {
            const { data } = await this.$axios.post('/contracts', contract);

            commit('addContract', data);
            commit('users/setUser', data.user, { root: true });
        }
    },

    async deleteContract({ commit }, contract) {
        await this.$axios.$delete(`/contracts/${contract.id}`);

        commit('deleteContract', contract);
    }
};
