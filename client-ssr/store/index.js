export const getters = {
    getLoggedInUser: state => {
        if (!state.auth.user) {
            return null;
        }

        return { ...state.auth.user };
    },

    isAdmin: state =>
        state.auth.user.roles?.some(role => role.name === 'admin'),
    isEmployee: state =>
        state.auth.user.roles?.some(role => role.name === 'employee')
};

export const actions = {
    nuxtServerInit() {
        const user = this.$auth.$storage.getUniversal('user');

        this.$auth.setUser(user);
    },

    async login(_, credentials) {
        const { data } = await this.$auth.loginWith('cookie', {
            data: credentials
        });

        this.$auth.setUser(data);

        this.$auth.$storage.setUniversal('user', data);
    },

    async logout() {
        await this.$auth.logout();

        this.$auth.$storage.removeUniversal('user');
    }
};
