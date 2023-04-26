import http from '../../plugins/axios';

export default {
    state: {
        loggedInUser: sessionStorage.getItem('loggedInUser')
            ? JSON.parse(sessionStorage.getItem('loggedInUser'))
            : null
    },

    getters: {
        getLoggedInUser: state => state.loggedInUser,
        isLoggedIn: state => !!state.loggedInUser,
        isAdmin: state =>
            state.loggedInUser.roles.some(roles => roles.name === 'admin'),
        isEmployee: state =>
            state.loggedInUser.roles.some(roles => roles.name === 'employee')
    },

    mutations: {
        setUser(state, user) {
            state.loggedInUser = user;

            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        },
        removeUser(state) {
            localStorage.removeItem('loggedInUser');
            state.loggedInUser = null;
        }
    },

    actions: {
        async login({ commit }, user) {
            const { data } = await http.post('/auth/login', user);
            await commit('setUser', data);
        },

        async logout({ commit }) {
            await http.post('/auth/logout');
            await commit('removeUser');
        }
    }
};
