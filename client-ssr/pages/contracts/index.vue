<template>
    <v-container fluid>
        <div v-if="$fetchState.pending">
            <v-progress-linear
                indeterminate
                color="blue-grey darken-1"
            ></v-progress-linear>
        </div>
        <div v-else>
            <v-card outlined rounded class="mt-1">
                <v-card
                    class="d-flex align-center justify-space-between"
                    outlined
                    rounded
                >
                    <v-card-title class="ml-6 justify-center">
                        Contracts
                    </v-card-title>
                    <v-btn
                        outlined
                        color="blue-grey lighten-5"
                        class="elevation-1 mr-3"
                        @click="openCreateOrEdit()"
                    >
                        <v-icon>mdi-plus</v-icon>Add Contract
                    </v-btn>
                </v-card>
                <contract-list
                    :contracts="contracts"
                    @edit="openCreateOrEdit"
                    @delete="openConfirmDelete"
                />
                <create-or-edit-contract
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
                    @canceled="showConfirmDelete = false"
                    @confirmed="onDelete"
                />
            </v-card>
        </div>
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ContractList from '~/components/contracts/ContractList';
import CreateOrEditContract from '~/components/contracts/CreateOrEditContract';

export default {
    components: { CreateOrEditContract, ContractList },
    layout: 'logged',
    middleware: 'auth-admin',
    data() {
        return {
            resourceName: 'contract',
            showCreateOrEditModal: false,
            selectedItem: null,
            showConfirmDelete: false
        };
    },
    async fetch() {
        await this.fetchContracts();
    },
    computed: {
        ...mapGetters({
            contracts: 'contracts/getContracts'
        })
    },
    methods: {
        ...mapActions('contracts', ['fetchContracts', 'deleteContract']),

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
                await this.deleteContract(this.selectedItem);

                this.selectedItem = null;
                this.showConfirmDelete = false;

                this.$notify({
                    title: 'Deleted',
                    text: 'Contract has been deleted',
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
