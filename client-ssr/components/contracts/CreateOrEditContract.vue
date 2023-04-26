<template>
    <v-dialog
        v-model="isModalShown"
        persistent
        scrollable
        width="500"
        transition="dialog-top-transition"
    >
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
                        :loading="isLoading"
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

                    <v-menu
                        v-model="isStartDatePickerVisible"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                label="Start Date"
                                type="date"
                                append-icon="mdi-calendar"
                                readonly
                                :value="formData.startDate"
                                :error-messages="startDateErrors"
                                v-bind="attrs"
                                v-on="on"
                            />
                        </template>
                        <v-date-picker
                            v-model="formData.startDate"
                            no-title
                            scrollable
                            @input="onStartDatePickerInput"
                        />
                    </v-menu>

                    <v-text-field
                        v-model="formData.duration"
                        :rules="durationRules"
                        :error-messages="durationErrors"
                        label="Duration"
                    />

                    <v-select
                        v-model="formData.vacationsPerYear"
                        :items="vacationsPerYearOptions"
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
import createOrEditValidator from '~/validators/contracts/createOrEditValidator.mixin';

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
            searchInput: null,
            isStartDatePickerVisible: false
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
                if (
                    (this.user && this.user.fullName === query) ||
                    this.isLoading
                ) {
                    return;
                }

                this.isLoading = true;
                this.searchedEmployees = await this.searchUsers(query);
                this.isLoading = false;
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

        this.formData = {
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
        ...mapActions({
            saveContract: 'contracts/saveContract',
            searchUsers: 'users/searchUsers'
        }),

        onChangeUser(user) {
            this.formData.userId = user ? user.id : null;
        },

        async submit() {
            this.$v.$touch();

            if (this.$v.$invalid) {
                return;
            }

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
            this.$emit('close-modal');
        },

        setDefaultFormData() {
            this.formData = { ...this.defaultFormData };
            this.searchedEmployees = [];
            this.user = {};
            this.serverErrors = [];
        },

        onStartDatePickerInput() {
            this.$v.formData.startDate.$touch();
            this.serverErrors = [];
            this.isStartDatePickerVisible = false;
        }
    }
};
</script>
