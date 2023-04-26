<template>
    <v-data-table :items="vacations" :items-per-page="5" :headers="headers">
        <template #[`item.fullName`]="{ item }">
            {{ item.user.firstName }} {{ item.user.lastName }}
        </template>
        <template #[`item.action`]="{ item }">
            <v-icon
                v-if="
                    (actions.edit && isAdmin) ||
                    (actions.edit && !item.confirmed)
                "
                small
                class="mr-2"
                color="blue-grey lighten-5"
                @click="$emit('edit', item)"
            >
                mdi-pencil
            </v-icon>
            <v-icon
                v-if="
                    (actions.delete && isAdmin) ||
                    (actions.delete && !item.confirmed)
                "
                small
                class="mr-2"
                color="red"
                @click="$emit('delete', item)"
            >
                mdi-delete
            </v-icon>
            <v-icon
                v-if="actions.confirm && isAdmin && !item.confirmed"
                small
                class="mr-2"
                color="green"
                @click="$emit('confirm', item)"
            >
                mdi-check
            </v-icon>
        </template>
    </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        actions: {
            type: Object,
            default: () => ({
                actions: {
                    edit: true,
                    confirm: true,
                    delete: true
                }
            })
        },
        vacations: {
            type: Array,
            required: false,
            default: () => []
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
                { text: 'Full Name', value: 'fullName' },
                {
                    text: 'Start date',
                    value: 'startDate',
                    sortable: false
                },
                {
                    text: 'End date',
                    value: 'endDate',
                    sortable: false
                },
                {
                    text: 'Duration',
                    value: 'duration',
                    sortable: false,
                    align: 'center'
                },
                {
                    text: 'Confirmed',
                    value: 'confirmed',
                    sortable: false,
                    align: 'center'
                },
                {
                    text: 'Actions',
                    value: 'action',
                    sortable: false
                }
            ]
        };
    },
    computed: {
        ...mapGetters({ isAdmin: 'isAdmin' })
    }
};
</script>
