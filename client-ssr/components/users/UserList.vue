<template>
    <v-data-table
        class="elevation-2 mt-5"
        :options.sync="tableOptions"
        :page="page"
        :headers="headers"
        :items="users"
        :items-per-page="10"
        :footer-props="{
            itemsPerPageOptions: [10, 25, 50]
        }"
        :server-items-length="count"
    >
        <template v-slot:[`item.action`]="{ item }">
            <v-icon
                v-if="actions.edit"
                small
                class="mr-2"
                color="blue-grey lighten-5"
                @click="$emit('edit', item)"
            >
                mdi-pencil
            </v-icon>
            <v-icon
                v-if="actions.delete"
                small
                class="mr-2"
                color="red"
                @click="$emit('delete', item)"
            >
                mdi-delete
            </v-icon>
        </template>
    </v-data-table>
</template>

<script>
export default {
    props: {
        actions: {
            type: Object,
            default: () => ({
                actions: {
                    edit: true,
                    delete: true
                }
            })
        },
        users: {
            type: Array,
            required: false,
            default: () => []
        },
        count: {
            type: Number,
            required: false,
            default: 0
        },
        page: {
            type: Number,
            required: false,
            default: 1
        }
    },
    data() {
        return {
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
                {
                    text: 'Vacation days total',
                    value: 'vacationDaysTotal',
                    sortable: false,
                    align: 'center'
                },
                {
                    text: 'Vacation days taken',
                    value: 'vacationDaysTaken',
                    sortable: false,
                    align: 'center'
                },
                {
                    text: 'Actions',
                    value: 'action',
                    sortable: false,
                    align: 'center'
                }
            ],
            showCreateOrEditModal: false,
            tableOptions: {}
        };
    },

    watch: {
        tableOptions: {
            handler(options) {
                this.$emit('update-table', options);
            },
            deep: true
        }
    }
};
</script>
