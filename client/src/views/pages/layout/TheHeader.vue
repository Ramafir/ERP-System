<template>
    <v-container>
        <v-app-bar color="deep-purple accent-4" dark dense absolute>
            <v-toolbar-title style="margin-left: 200px">
                ERP System
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <template>
                <h3>{{ loggedUser.email }}</h3>
                <router-link to="/logout" class="text-decoration-none">
                    <v-list-item @click="logout">
                        <v-list-item-title class="title" style="color: white">
                            Logout
                        </v-list-item-title>
                        <v-btn icon @click="logout" color="white">
                            <v-icon>mdi-logout</v-icon>
                        </v-btn>
                    </v-list-item>
                </router-link>
            </template>
        </v-app-bar>
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
    computed: {
        ...mapGetters({ loggedUser: 'getLoggedInUser' })
    },
    methods: {
        ...mapActions(['logout'])
    }
};
</script>
