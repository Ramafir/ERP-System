import http from '../../plugins/axios';

export default {
    state: {
        users: [],
        deletedUsers: []
    },
    getters: {
        getAllUsers: state => state.users,
        getDeletedUsers: state => state.deletedUsers
    },
    mutations: {
        setUsers(state, { rows }) {
            state.users = rows;
        },

        setDeletedUsers(state, { rows }) {
            state.deletedUsers = rows;
        },

        setUser(state, user) {
            const userIndex = state.users.findIndex(u => u.id === user.id);

            if (userIndex) {
                state.users.splice(userIndex, 1, user);
            }
        },

        deleteUser(state, user) {
            const userIndex = state.users.findIndex(u => u.id === user.id);

            state.users.splice(userIndex, 1);
        },

        addUser(state, user) {
            state.users.unshift(user);
        },

        addDeletedUser(state, data) {
            state.deletedUsers.unshift(data);
        }
    },
    actions: {
        async fetchUsers({ commit }) {
            const { data } = await http.get('/users');

            commit('setUsers', data);

            return data;
        },

        async fetchDeletedUsers({ commit }) {
            const { data } = await http.get('/users?deleted=true');

            commit('setDeletedUsers', data);

            return data;
        },

        async searchUsers(vuexContext, query) {
            const {
                data: { rows }
            } = await http.get('/users', { params: { query } });

            return rows;
        },

        async saveUser({ commit }, user) {
            if (user.id) {
                const { data } = await http.put(`/users/${user.id}`, user);
                commit('setUser', data);
            } else {
                const { data } = await http.post('/users', user);
                commit('addUser', data);
            }
        },

        async deleteUser({ commit }, user) {
            await http.delete(`/users/${user.id}`);

            commit('deleteUser', user);

            commit('addDeletedUser', user);
        }
    }
};
