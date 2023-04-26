<template>
    <v-app dark>
        <TheHeader />
        <TheSidebar />
        <v-main>
            <v-container>
                <Nuxt />
            </v-container>
        </v-main>
        <v-footer :absolute="!fixed" app>
            <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
        <client-only>
            <notifications position="bottom right" />
        </client-only>
    </v-app>
</template>

<script>
import TheSidebar from '~/components/navigation/TheSidebar';
import TheHeader from '~/components/navigation/TheHeader';

export default {
    name: 'logged',
    components: { TheHeader, TheSidebar },
    data() {
        return {
            fixed: false
        };
    }
};
</script>

<style scoped></style>
