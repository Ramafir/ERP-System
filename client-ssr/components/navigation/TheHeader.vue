<template>
    <v-container>
        <v-app-bar
            color="blue-grey darken-1"
            dark
            dense
            absolute
            app
            clipped-left
        >
            <v-toolbar-title> ERP System </v-toolbar-title>
            <v-spacer />
            <template>
                <h3>{{ $auth.user.email }}</h3>
                <NuxtLink to="/logout" class="text-decoration-none">
                    <v-list-item @click="logout">
                        <v-list-item-title class="title">
                            Logout
                        </v-list-item-title>
                        <v-btn icon color="white" @click="logout">
                            <v-icon>mdi-logout</v-icon>
                        </v-btn>
                    </v-list-item>
                </NuxtLink>
            </template>
        </v-app-bar>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions(['logout'])
    }
};
</script>
