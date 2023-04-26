<template>
    <v-navigation-drawer
        class="blue-grey darken-1"
        dark
        app
        clipped
        permanent
        width="200"
    >
        <v-divider />
        <v-list dense nav>
            <NuxtLink to="/dashboard" center class="text-decoration-none">
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon>mdi-view-dashboard</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="mr-0">
                        <v-list-item-title>Dashboard</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </NuxtLink>
            <NuxtLink
                v-if="isAdmin"
                to="/users"
                center
                class="text-decoration-none"
            >
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon>mdi-account-hard-hat</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="mr-0">
                        <v-list-item-title>Employees</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </NuxtLink>
            <NuxtLink
                v-if="isAdmin"
                to="/contracts"
                center
                class="text-decoration-none"
            >
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon>mdi-file-document-edit</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="mr-0">
                        <v-list-item-title>Contracts</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </NuxtLink>
            <NuxtLink
                v-if="isAdmin"
                to="/vacations"
                center
                class="text-decoration-none"
            >
                <v-list-item>
                    <v-list-item-icon>
                        <v-icon>mdi-beach</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="mr-0">
                        <v-list-item-title>Vacations</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </NuxtLink>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({ isAdmin: 'isAdmin' })
    }
};
</script>
