<template>
    <v-container>
        <v-card rounded outlined style="margin-top: 2%">
            <v-card-title class="ml-6 justify-center">
                Vacation requests
            </v-card-title>
            <vacation-list
                :vacations="vacations"
                :actions="{ edit: false, delete: false, confirm: true }"
                @confirm-vacation="openConfirmVacation"
            />
        </v-card>
        <confirm-vacation
            v-if="showConfirmVacation"
            :show-confirm-vacation="showConfirmVacation"
            :selected-item="selectedItem"
            @canceled="showConfirmVacation = false"
            @confirmed="onConfirm"
        />
    </v-container>
</template>

<script>
import VacationList from '@/components/vacations/VacationList';
import ConfirmVacation from '@/components/vacations/ConfirmVacation';
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'AdminDashboard',
    components: {
        ConfirmVacation,
        VacationList
    },
    data() {
        return {
            selectedItem: null,
            showConfirmVacation: false
        };
    },
    computed: {
        ...mapGetters({
            vacations: 'getVacationsToConfirm'
        })
    },
    created() {
        this.fetchUnconfirmedVacations();
    },
    methods: {
        ...mapActions(['fetchUnconfirmedVacations', 'confirmVacation']),

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

<style scoped></style>
