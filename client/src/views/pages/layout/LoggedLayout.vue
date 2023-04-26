<template>
    <v-container>
        <the-header />
        <the-sidebar />
        <router-view />
    </v-container>
</template>

<script>
import TheHeader from '@/views/pages/layout/TheHeader';
import TheSidebar from '@/views/pages/layout/TheSidebar';
export default {
    name: 'LoggedLayout',
    components: { TheHeader, TheSidebar }
};
</script>

<style scoped></style>
