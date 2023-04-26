<template>
    <component :is="componentSelection"></component>
</template>

<script>
import { mapGetters } from 'vuex';
import AdminDashboard from '@/views/pages/dashboards/AdminDashboard';
import EmployeeDashboard from '@/views/pages/dashboards/EmployeeDashboard';

export default {
    name: 'MainDashboard',
    components: {
        'admin-dashboard': AdminDashboard,
        'employee-dashboard': EmployeeDashboard
    },
    data() {
        return {};
    },
    computed: {
        ...mapGetters({ isAdmin: 'isAdmin' }),

        componentSelection() {
            if (this.isAdmin) {
                return 'admin-dashboard';
            } else {
                return 'employee-dashboard';
            }
        }
    }
};
</script>

<style scoped></style>
