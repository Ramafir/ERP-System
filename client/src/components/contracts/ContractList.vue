<template>
    <v-card>
        <v-data-table :items="contracts" :items-per-page="5" :headers="headers">
            <template v-slot:[`item.fullName`]="{ item }">
                {{ item.user.firstName }} {{ item.user.lastName }}
            </template>
            <template v-slot:[`item.action`]="{ item }">
                <v-icon
                    small
                    class="mr-2"
                    color="primary"
                    @click="editContract(item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon
                    small
                    class="mr-2"
                    color="red"
                    @click="deleteContract(item)"
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
                { text: 'Actions', value: 'action', sortable: false }
            ]
        };
    },
    methods: {
        editContract(contract) {
            this.$emit('edit-contract', contract);
        },

        deleteContract(contract) {
            this.$emit('delete-contract', contract);
        }
    }
};
</script>

<style scoped></style>
