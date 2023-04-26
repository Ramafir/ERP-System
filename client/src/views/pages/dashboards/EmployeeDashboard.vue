<template>
    <v-container fluid>
        <v-card rounded outlined>
            <v-card-title class="ml-6 mt-3 justify-center">
                Information about your vacation days
            </v-card-title>
            <v-simple-table class="table table-hover">
                <thead>
                    <tr>
                        <th>Days of Vacation Left</th>
                        <th>Days of Vacation Taken</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ calculateVacationDaysRemaining() }}</td>
                        <td>{{ currentEmployee.vacationDaysTaken }}</td>
                    </tr>
                </tbody>
            </v-simple-table>
        </v-card>
        <v-card
            class="d-flex align-center justify-space-between mt-6"
            outlined
            rounded
        >
            <v-card-title class="ml-6">Vacation requests</v-card-title>
            <v-btn
                outlined
                color="primary"
                class="elevation-1 mt-3"
                @click="openCreateOrEdit()"
            >
                <v-icon>mdi-plus</v-icon>Request Vacation
            </v-btn>
        </v-card>
        <vacation-list
            :vacations="vacations"
            :actions="{ edit: true, delete: true, confirm: false }"
            @edit="openCreateOrEdit"
            @delete="openConfirmDelete"
        />
        <create-or-edit-vacation
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
import CreateOrEditVacation from '@/components/vacations/CreateOrEditVacation';
import VacationList from '@/components/vacations/VacationList';
import ConfirmDelete from '@/components/ConfirmDelete';

export default {
    name: 'EmployeeDashboard',
    components: { ConfirmDelete, VacationList, CreateOrEditVacation },
    data() {
        return {
            resourceName: 'vacation',
            vacationDaysRemaining: 0,
            showCreateOrEditModal: false,
            showConfirmDelete: false,
            selectedItem: null
        };
    },
    computed: {
        ...mapGetters({
            currentEmployee: 'getLoggedInUser',
            vacations: 'getVacations'
        })
    },
    created() {
        this.fetchVacations();
    },
    methods: {
        ...mapActions(['fetchVacations', 'deleteVacation']),

        calculateVacationDaysRemaining() {
            return (this.vacationDaysRemaining =
                this.currentEmployee.vacationDaysTotal -
                this.currentEmployee.vacationDaysTaken);
        },

        openCreateOrEdit(selectedItem) {
            this.selectedItem = selectedItem;
            this.showCreateOrEditModal = true;
        },

        openConfirmDelete(selectedItem) {
            this.selectedItem = selectedItem;
            this.showConfirmDelete = true;
        },

        closeCreateOrEdit() {
            this.selectedItem = null;
            this.showCreateOrEditModal = false;
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
        }
    }
};
</script>

<style scoped></style>
