<template>
    <v-container fluid>
        <v-card
            class="d-flex align-center justify-space-between mt3"
            outlined
            rounded
        >
            <v-card-title class="ml-6 justify-center">Employees</v-card-title>
            <v-btn
                outlined
                color="primary"
                class="elevation-1 mr-3"
                data-cy="add-employee"
                @click="openCreateOrEdit()"
            >
                <v-icon>mdi-plus</v-icon>Add Employee
            </v-btn>
        </v-card>
        <user-list
            :users="users"
            data-cy="users-list"
            @edit-user="openCreateOrEdit"
            @delete-user="openConfirmDelete"
        />
        <v-divider />
        <v-card rounded outlined class="mt-3">
            <v-card-title class="ml-6 justify-center">
                Deleted Employees
            </v-card-title>
            <user-list
                :users="deletedUsers"
                @edit-user="openCreateOrEdit"
                @delete-user="openConfirmDelete"
            />
        </v-card>
        <create-or-edit-user
            v-if="showCreateOrEditModal"
            :show-create-or-edit-modal="showCreateOrEditModal"
            :selected-item="selectedItem"
            @closeModal="closeCreateOrEdit"
        />
        <confirm-delete
            v-if="showConfirmDelete"
            :resource-name="resourceName"
            :show-confirm-delete="showConfirmDelete"
            :selected-item="selectedItem"
            @canceled="showConfirmDelete = false"
            @confirmed="onDelete"
        />
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import UserList from '@/components/users/UserList';
import CreateOrEditUser from '@/components/users/CreateOrEditUser';
import ConfirmDelete from '@/components/ConfirmDelete';

export default {
    components: {
        ConfirmDelete,
        UserList,
        CreateOrEditUser
    },
    data() {
        return {
            resourceName: 'user',
            showCreateOrEditModal: false,
            selectedItem: null,
            showConfirmDelete: false
        };
    },
    computed: {
        ...mapGetters({ users: 'getAllUsers', deletedUsers: 'getDeletedUsers' })
    },
    created() {
        this.fetchUsers();
        this.fetchDeletedUsers();
    },
    methods: {
        ...mapActions(['fetchUsers', 'fetchDeletedUsers', 'deleteUser']),

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
        }
    }
};
</script>
