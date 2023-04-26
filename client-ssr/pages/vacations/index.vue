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
                    <v-card-title class="ml-6">Vacation</v-card-title>
                    <v-btn
                        outlined
                        color="blue-grey lighten-5"
                        class="elevation-1 mr-3"
                        @click="openCreateOrEdit()"
                    >
                        <v-icon>mdi-plus</v-icon>Add Vacation
                    </v-btn>
                </v-card>
                <vacation-list
                    :vacations="vacations"
                    :actions="{ edit: true, delete: true, confirm: true }"
                    @edit="openCreateOrEdit"
                    @delete="openConfirmDelete"
                    @confirm="openConfirmVacation"
                />
                <create-or-edit-vacation
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
                <confirm-vacation
                    v-if="showConfirmVacation"
                    :show-confirm-vacation="showConfirmVacation"
                    :selected-item="selectedItem"
                    @canceled="showConfirmVacation = false"
                    @confirmed="onConfirm"
                />
            </v-card>
        </div>
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ConfirmVacation from '~/components/vacations/ConfirmVacation';
import VacationList from '~/components/vacations/VacationList';
import CreateOrEditVacation from '~/components/vacations/CreateOrEditVacation';

export default {
    components: { CreateOrEditVacation, VacationList, ConfirmVacation },
    layout: 'logged',
    middleware: 'auth-admin',
    data() {
        return {
            resourceName: 'vacation',
            showCreateOrEditModal: false,
            selectedItem: null,
            showConfirmDelete: false,
            showConfirmVacation: false
        };
    },
    async fetch() {
        await this.fetchVacations();
    },
    computed: {
        ...mapGetters({
            vacations: 'vacations/getVacations'
        })
    },
    methods: {
        ...mapActions('vacations', [
            'fetchVacations',
            'deleteVacation',
            'confirmVacation'
        ]),

        openCreateOrEdit(selectedItem = null) {
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

        openConfirmVacation(selectedItem) {
            this.selectedItem = selectedItem;
            this.showConfirmVacation = true;
        },

        async onDelete() {
            try {
                await this.deleteVacation(this.selectedItem);
                this.selectedItem = null;
                this.showConfirmDelete = false;

                this.$notify({
                    title: 'Deleted',
                    text: 'Vacation request has been deleted',
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

        async onConfirm() {
            try {
                await this.confirmVacation(this.selectedItem.id);

                this.selectedItem = null;
                this.showConfirmVacation = false;

                this.$notify({
                    title: 'Confirmed',
                    text: 'Vacation request has been confirmed',
                    type: 'success'
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
