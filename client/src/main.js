import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import vuetify from './plugins/vuetify';
import initSentry from './plugins/sentry';
import Notifications from 'vue-notification';

Vue.use(Notifications);

Vue.config.productionTip = false;

initSentry(Vue);

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app');
