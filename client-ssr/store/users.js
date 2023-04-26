export const state = () => ({
    users: [],
    deletedUsers: [],
    userCount: 0,
    deletedCount: 0
});

export const getters = {
    getAllUsers: state => state.users,
    getDeletedUsers: state => state.deletedUsers,
    getUserCount: state => state.userCount,
    getDeletedCount: state => state.deletedCount
};

export const mutations = {
    setUsers(state, { rows }) {
        state.users = rows;
    },

    setDeletedUsers(state, { rows }) {
        state.deletedUsers = rows;
    },

    setUser(state, user) {
        const userIndex = state.users.findIndex(u => u.id === user.id);

        if (~userIndex) {
            state.users.splice(userIndex, 1, user);
        }
    },

    setUserCount: (state, { count }) => {
        state.userCount = count;
    },

    setDeletedCount: (state, { count }) => {
        state.deletedCount = count;
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
    },

    addToUserCount: (state, number) => {
        state.userCount += number;
    },

    addToDeletedCount: (state, number) => {
        state.deletedCount += number;
    }
};

export const actions = {
    async fetchUsers({ commit }, params = {}) {
        const data = await this.$axios.$get('/users', { params });

        if (params.deleted) {
            commit('setDeletedUsers', data);
            commit('setDeletedCount', data);

            return data;
        }

        commit('setUsers', data);
        commit('setUserCount', data);

        return data;
    },

    async searchUsers(vuexContext, query) {
        const {
            data: { rows }
        } = await this.$axios.get('/users', { params: { query } });

        return rows;
    },

    async saveUser({ commit }, user) {
        if (user.id) {
            const { data } = await this.$axios.put(`/users/${user.id}`, user);

            commit('setUser', data);
        } else {
            const { data } = await this.$axios.post('/users', user);

            commit('addUser', data);
            commit('addToUserCount', 1);
        }
    },

    async deleteUser({ commit }, user) {
        await this.$axios.$delete(`/users/${user.id}`);

        commit('deleteUser', user);
        commit('addDeletedUser', user);
        commit('addToUserCount', -1);
        commit('addToDeletedCount', 1);
    }
};
