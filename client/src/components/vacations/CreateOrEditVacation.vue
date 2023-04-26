<template>
    <v-dialog v-model="isModalShown" persistent scrollable width="900">
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
                        v-if="isAdmin"
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

                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field
                                v-model="formData.startDate"
                                label="Start Date"
                                :rules="startDateRules"
                                :error-messages="startDateErrors"
                                readonly
                            />

                            <v-date-picker
                                v-model="formData.startDate"
                                :allowed-dates="allowedDates"
                                :first-day-of-week="1"
                                label="Start Date"
                            />
                        </v-col>

                        <v-spacer />

                        <v-col cols="12" sm="6" md="4">
                            <v-text-field
                                v-model="formData.endDate"
                                label="End Date"
                                :rules="endDateRules"
                                :error-messages="endDateErrors"
                                readonly
                            />

                            <v-date-picker
                                v-model="formData.endDate"
                                :min="formData.startDate"
                                :allowed-dates="allowedDates"
                                :first-day-of-week="1"
                                label="End Date"
                            />
                        </v-col>
                    </v-row>

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
import dayjs from 'dayjs';
import { mapActions, mapGetters } from 'vuex';
import createOrEditValidator from '@/validators/vacations/createOrEditValidator.mixin';

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
            endDate: ''
        };

        return {
            defaultFormData,
            formData: { ...defaultFormData },
            user: {},
            searchedEmployees: [],
            searchInput: null,
            startDateInput: null,
            isLoading: false,
            isModalShown: this.showCreateOrEditModal
        };
    },
    computed: {
        ...mapGetters({
            isAdmin: 'isAdmin',
            currentUser: 'getLoggedInUser'
        }),

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
        },

        'formData.startDate': {
            handler(val) {
                if (!this.selectedItem) {
                    this.formData.endDate = val;
                } else {
                    const initVal = this.selectedItem.startDate;

                    if (this.formData.startDate !== initVal) {
                        this.formData.endDate = val;
                    }
                }
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

            this.searchedEmployees.push(this.user);
        }
    },
    methods: {
        ...mapActions(['saveVacation', 'searchUsers', 'fetchUsers']),

        onChangeUser(user) {
            this.formData.userId = user ? user.id : null;
        },

        async submit() {
            this.$v.$touch();

            try {
                await this.saveVacation(this.formData);
                this.onClose();

                this.$notify({
                    title: 'Created',
                    text: 'New vacation request has been created',
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
            return !this.selectedItem ? 'New vacation' : 'Edit vacation';
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
        },

        allowedDates(val) {
            return dayjs(val).day() !== 0 && dayjs(val).day() !== 6;
        }
    }
};
</script>
