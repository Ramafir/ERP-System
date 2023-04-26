<template>
    <v-dialog v-model="isModalShown" persistent scrollable width="500">
        <v-card class="pa-3">
            <v-form @submit.prevent="submit">
                <v-card-title class="d-flex justify-space-between px-6">
                    {{ formTitle() }}
                    <v-btn icon @click="onClose">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <div class="px-6">
                    <v-autocomplete
                        v-model="user"
                        :items="users"
                        label="Employee"
                        :search-input.sync="searchInput"
                        :rules="userIdRules"
                        :error-messages="userIdErrors"
                        hide-no-data
                        hide-selected
                        return-object
                        clearable
                        item-text="fullName"
                        item-value="id"
                        placeholder="Search..."
                        @change="onChangeUser"
                    />

                    <v-text-field
                        v-model="formData.startDate"
                        type="date"
                        :rules="startDateRules"
                        :error-messages="startDateErrors"
                        label="Start date"
                    />

                    <v-text-field
                        v-model="formData.duration"
                        :rules="durationRules"
                        :error-messages="durationErrors"
                        label="Duration"
                    />

                    <v-select
                        v-model="formData.vacationsPerYear"
                        :items="vacationsPerYearOptions"
                        :rules="vacationsPerYearRules"
                        :error-messages="vacationsPerYearErrors"
                        label="Vacations per year"
                    />

                    <v-text-field
                        v-model="formData.jobPosition"
                        :rules="jobPositionRules"
                        :error-messages="jobPositionErrors"
                        label="Job title"
                    />

                    <v-card-actions class="d-flex justify-center">
                        <v-btn outlined color="primary" type="submit">
                            submit
                        </v-btn>
                    </v-card-actions>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import createOrEditValidator from '@/validators/contracts/createOrEditValidator.mixin';

export default {
    mixins: [createOrEditValidator],
    props: {
        selectedItem: Object,
        showCreateOrEditModal: Boolean
    },
    data() {
        const defaultFormData = {
            userId: null,
            startDate: '',
            jobPosition: '',
            duration: '',
            vacationsPerYear: ''
        };

        return {
            defaultFormData,
            formData: { ...defaultFormData },
            vacationsPerYearOptions: [20, 26],
            user: {},
            isModalShown: this.showCreateOrEditModal,
            isLoading: false,
            searchedEmployees: [],
            searchInput: null
        };
    },
    computed: {
        users() {
            return this.searchedEmployees.map(user => {
                return {
                    id: user.id,
                    fullName: user.firstName + ' ' + user.lastName
                };
            });
        }
    },
    watch: {
        async searchInput(query) {
            try {
                if (this.user && this.user.fullName === query) return;

                this.searchedEmployees = await this.searchUsers(query);
            } catch (error) {
                console.error(error);
                this.checkErrorResponse(error);

                this.$notify({
                    text: 'Something wrong happen with searching employees',
                    type: 'error'
                });
            }
        }
    },
    created() {
        this.setDefaultFormData();

        if (!this.selectedItem) {
            return;
        }

        this.form = {
            ...this.selectedItem
        };

        const { user } = this.selectedItem;

        if (user) {
            this.user = {
                id: user.id,
                fullName: user.firstName + ' ' + user.lastName
            };

            this.searchedEmployees.push(user);
        }
    },
    methods: {
        ...mapActions(['saveContract', 'searchUsers', 'fetchUsers']),

        onChangeUser(user) {
            this.formData.userId = user ? user.id : null;
        },

        async submit() {
            this.$v.$touch();

            try {
                await this.saveContract(this.formData);
                this.onClose();

                this.$notify({
                    title: 'Created',
                    text: 'New contract has been created',
                    type: 'success'
                });
            } catch (error) {
                console.error(error);
                this.checkErrorResponse(error);

                this.$notify({
                    title: 'Error',
                    text: error,
                    type: 'error'
                });
            }
        },

        formTitle() {
            return !this.selectedItem ? 'New contract' : 'Edit contract';
        },

        onClose() {
            this.$v.$reset();
            this.setDefaultFormData();
            this.$emit('closeModal');
        },

        setDefaultFormData() {
            this.formData = { ...this.defaultFormData };
            this.searchedEmployees = [];
            this.user = {};
            this.serverErrors = [];
        }
    }
};
</script>
