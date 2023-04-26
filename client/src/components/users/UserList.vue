<template>
    <v-card>
        <v-data-table :items="users" :items-per-page="5" :headers="headers">
            <template v-slot:[`item.action`]="{ item }">
                <v-icon
                    v-if="!item.deletedAt"
                    small
                    class="mr-2"
                    color="primary"
                    @click="editUser(item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon
                    v-if="!item.deletedAt"
                    small
                    class="mr-2"
                    color="red"
                    @click="deleteUser(item)"
                >
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
export default {
    props: {
        users: {
            type: Array,
            required: false,
            defaultValue: () => []
        }
    },
    data() {
        return {
            showCreateOrEditModal: false,
            headers: [
                {
                    text: 'ID',
                    value: 'id',
                    sortable: false
                },
                {
                    text: 'First name',
                    value: 'firstName',
                    sortable: false
                },
                {
                    text: 'Last name',
                    value: 'lastName',
                    sortable: false
                },
                {
                    text: 'Email',
                    value: 'email',
                    sortable: false
                },
                {
                    text: 'Date of birth',
                    value: 'birthDate',
                    sortable: false
                },
                { text: 'Actions', value: 'action', sortable: false }
            ]
        };
    },
    methods: {
        editUser(user) {
            this.$emit('edit-user', user);
        },

        deleteUser(user) {
            this.$emit('delete-user', user);
        }
    }
};
</script>

<style scoped></style>
