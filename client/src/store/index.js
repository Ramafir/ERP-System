import Vuex from 'vuex';
import Vue from 'vue';
import auth from './modules/auth';
import users from './modules/users';
import contracts from '@/store/modules/contracts';
import vacations from '@/store/modules/vacations';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        auth,
        users,
        contracts,
        vacations
    }
});

export default store;
