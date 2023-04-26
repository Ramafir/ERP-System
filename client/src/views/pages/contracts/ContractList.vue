<template>
    <v-container fluid>
        <v-card
            class="d-flex align-center justify-space-between mt-3"
            outlined
            rounded
        >
            <v-card-title class="ml-6 justify-center">Contracts</v-card-title>
            <v-btn
                outlined
                color="primary"
                class="elevation-1 mr-3"
                @click="openCreateOrEdit()"
            >
                <v-icon>mdi-plus</v-icon>Add Contract
            </v-btn>
        </v-card>
        <contract-list
            :contracts="contracts"
            @edit-contract="openCreateOrEdit"
            @delete-contract="openConfirmDelete"
        />
        <create-or-edit-contract
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
import ContractList from '@/components/contracts/ContractList';
import CreateOrEditContract from '@/components/contracts/CreateOrEditContract';
import ConfirmDelete from '@/components/ConfirmDelete';

export default {
    components: {
        ConfirmDelete,
        CreateOrEditContract,
        ContractList
    },
    data() {
        return {
            resourceName: 'contract',
            showCreateOrEditModal: false,
            selectedItem: null,
            showConfirmDelete: false
        };
    },
    computed: {
        ...mapGetters({
            contracts: 'getAllContracts'
        })
    },
    created() {
        this.fetchContracts();
    },
    methods: {
        ...mapActions(['fetchContracts', 'deleteContract']),

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
