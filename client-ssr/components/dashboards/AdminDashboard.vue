<template>
    <v-container>
        <div v-if="$fetchState.pending">
            <v-progress-linear
                indeterminate
                color="blue-grey darken-1"
            ></v-progress-linear>
        </div>
        <div v-else>
            <v-card outlined rounded class="mt-1">
                <v-card-title class="ml-6 justify-center">
                    Vacation requests
                </v-card-title>
                <vacation-list
                    :vacations="vacations"
                    :actions="{ edit: false, delete: false, confirm: true }"
                    @confirm="openConfirmVacation"
                />
            </v-card>
            <confirm-vacation
                v-if="showConfirmVacation"
                :show-confirm-vacation="showConfirmVacation"
                :selected-item="selectedItem"
                @canceled="showConfirmVacation = false"
                @confirmed="onConfirm"
            />
        </div>
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import VacationList from '~/components/vacations/VacationList';
import ConfirmVacation from '~/components/vacations/ConfirmVacation';

export default {
    name: 'AdminDashboard',
    components: { ConfirmVacation, VacationList },
    data() {
        return {
            selectedItem: null,
            showConfirmVacation: false
        };
    },
    async fetch() {
        await this.fetchUnconfirmedVacations();
    },
    computed: {
        ...mapGetters({
            vacations: 'vacations/getVacationsToConfirm'
        })
    },
    methods: {
        ...mapActions('vacations', [
            'fetchUnconfirmedVacations',
            'confirmVacation'
        ]),

        openConfirmVacation(selectedItem) {
            this.selectedItem = selectedItem;
            this.showConfirmVacation = true;
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
