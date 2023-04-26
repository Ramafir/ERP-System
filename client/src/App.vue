<template>
    <v-app>
        <component :is="layout"></component>
        <notifications position="bottom right" />
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import DefaultLayout from '@/views/pages/layout/DefaultLayout';
import LoggedLayout from '@/views/pages/layout/LoggedLayout';

export default {
    name: 'App',
    components: {
        DefaultLayout,
        LoggedLayout
    },
    computed: {
        ...mapGetters({ isLoggedIn: 'isLoggedIn' }),

        layout() {
            const layout = this.$route.meta.layout || 'Default';
            return `${layout}Layout`;
        }
    }
};
</script>
