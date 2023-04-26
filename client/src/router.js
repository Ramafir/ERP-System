import Router from 'vue-router';
import Vue from 'vue';
import store from './store/index';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        { path: '/', redirect: '/login' },
        {
            path: '/login',
            component: () => import('@/components/users/UserLogin'),
            meta: { layout: 'Default' }
        },
        {
            path: '/dashboard',
            component: () => import('@/views/pages/dashboards/MainDashboard'),
            meta: { requiresAuth: true, layout: 'Logged' }
        },
        {
            path: '/users',
            component: () => import('@/views/pages/users/UserList'),
            meta: { requiresAuth: true, layout: 'Logged' }
        },
        {
            path: '/contracts',
            component: () => import('@/views/pages/contracts/ContractList'),
            meta: { requiresAuth: true, layout: 'Logged' }
        },
        {
            path: '/vacations',
            component: () => import('@/views/pages/vacations/VacationList'),
            meta: { requiresAuth: true, layout: 'Logged' }
        },
        {
            path: '/logout',
            beforeEnter(to, from, next) {
                next('/');
            }
        }
    ]
});

router.beforeEach(function (to, _, next) {
    if (to.meta.requiresAuth && !store.getters.isLoggedIn) {
        next('/login');
    } else if (to.meta.requiresUnauth && store.getters.isLoggedIn) {
        next('/dashboard');
    } else {
        next();
    }
});

export default router;
