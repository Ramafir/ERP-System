import http from '../../plugins/axios';

export default {
    state: {
        contracts: []
    },
    getters: {
        getAllContracts: state => state.contracts
    },
    mutations: {
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
    },
    actions: {
        async fetchContracts({ commit }) {
            const { data } = await http.get('/contracts');

            commit('setContracts', data);

            return data;
        },

        async saveContract({ commit }, contract) {
            if (contract.id) {
                const { data } = await http.put(
                    `/contracts/${contract.id}`,
                    contract
                );

                commit('setContract', data);
                commit('setUsers', data.user, { root: true });
            } else {
                const { data } = await http.post('/contracts', contract);

                commit('addContract', data);
                commit('setUser', data.user, { root: true });
            }
        },

        async deleteContract({ commit }, contract) {
            await http.delete(`/contracts/${contract.id}`);

            commit('deleteContract', contract);
        }
    }
};
