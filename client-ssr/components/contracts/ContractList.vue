<template>
    <v-data-table :items="contracts" :items-per-page="5" :headers="headers">
        <template #[`item.fullName`]="{ item }">
            {{ item.user.firstName }} {{ item.user.lastName }}
        </template>
        <template #[`item.action`]="{ item }">
            <v-icon
                small
                class="mr-2"
                color="blue-grey lighten-5"
                @click="$emit('edit', item)"
            >
                mdi-pencil
            </v-icon>
            <v-icon
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
        contracts: {
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
                    text: 'Job title',
                    value: 'jobPosition',
                    sortable: false
                },
                {
                    text: 'Actions',
                    value: 'action',
                    sortable: false,
                    align: 'center'
                }
            ]
        };
    }
};
</script>
