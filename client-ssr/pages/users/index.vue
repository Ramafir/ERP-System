<template>
    <v-container fluid class="pa-0 ma-0">
        <div v-if="$fetchState.pending">
            <v-progress-linear indeterminate color="blue-grey darken-1" />
        </div>
        <div v-else>
            <v-card outlined rounded class="mt-3">
                <v-card
                    class="d-flex align-center justify-space-between"
                    outlined
                    rounded
                >
                    <v-card-title class="ml-6 justify-center">
                        Employees
                    </v-card-title>
                    <v-btn
                        outlined
                        color="blue-grey lighten-5"
                        class="elevation-1 mr-3"
                        data-cy="add-employee"
                        @click="openCreateOrEdit()"
                    >
                        <v-icon>mdi-plus</v-icon>Add Employee
                    </v-btn>
                </v-card>
                <user-employee-list
                    :users="users"
                    :count="userCount"
                    data-cy="users-list"
                    @edit="openCreateOrEdit"
                    @delete="openConfirmDelete"
                    @index-users="indexUsers"
                />
            </v-card>
            <v-divider />
            <v-card outlined rounded class="mt-3">
                <v-card>
                    <v-card-title class="ml-6 justify-center">
                        Deleted Employees
                    </v-card-title>
                    <user-deleted-list
                        :users="deletedUsers"
                        :count="deletedCount"
                        @edit="openCreateOrEdit"
                        @delete="openConfirmDelete"
                        @index-users="indexUsers"
                    />
                </v-card>
                <create-or-edit-user
                    v-if="showCreateOrEditModal"
                    :show-create-or-edit-modal="showCreateOrEditModal"
                    :selected-item="selectedItem"
                    @close-modal="closeCreateOrEdit"
                />
                <confirm-delete
                    v-if="showConfirmDelete"
                    :resource-name="resourceName"
                    :show-confirm-delete="showConfirmDelete"
                    :selected-item="selectedItem"
                    :actions="{ edit: false, delete: false }"
                    @canceled="showConfirmDelete = false"
                    @confirmed="onDelete"
                />
            </v-card>
        </div>
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CreateOrEditUser from '~/components/users/CreateOrEditUser';
import UserEmployeeList from '~/components/users/UserEmployeeList';
import UserDeletedList from '~/components/users/UserDeletedList';

export default {
    components: {
        UserDeletedList,
        UserEmployeeList,
        CreateOrEditUser
    },
    layout: 'logged',
    middleware: 'auth-admin',
    data() {
        return {
            resourceName: 'user',
            showCreateOrEditModal: false,
            selectedItem: null,
            showConfirmDelete: false
        };
    },
    async fetch() {
        await this.indexUsers(this.params);
    },
    computed: {
        ...mapGetters({
            users: 'users/getAllUsers',
            deletedUsers: 'users/getDeletedUsers',
            userCount: 'users/getUserCount',
            deletedCount: 'users/getDeletedCount'
        })
    },
    watch: {
        params: {
            async handler(params) {
                await this.indexUsers(params);
            },
            deep: true
        },

        deletedParams: {
            async handler(params) {
                await this.indexUsers(params);
            },
            deep: true
        }
    },
    methods: {
        ...mapActions('users', ['deleteUser', 'fetchUsers']),

        openCreateOrEdit(selectedItem) {
            this.selectedItem = selectedItem;
            this.showCreateOrEditModal = true;
        },

        closeCreateOrEdit() {
            this.selectedItem = null;
            this.showCreateOrEditModal = false;
        },

        openConfirmDelete(selectedItem) {
            this.selectedItem = selectedItem;
            this.showConfirmDelete = true;
        },

        async onDelete() {
            try {
                await this.deleteUser(this.selectedItem);

                this.selectedItem = null;
                this.showConfirmDelete = false;

                this.$notify({
                    title: 'Deleted',
                    text: 'User has been deleted',
                    type: 'warn'
                });
            } catch (error) {
                console.error(error);
                this.$notify({
                    text: error,
                    type: 'error'
                });
            }
        },

        async indexUsers(params) {
            try {
                await this.fetchUsers(params);
            } catch (err) {
                this.$notify({
                    group: 'notify',
                    type: 'error',
                    title: 'Data fetching',
                    text: 'Something went wrong with fetching'
                });

                console.error(err);
            }
        }
    }
};
</script>
