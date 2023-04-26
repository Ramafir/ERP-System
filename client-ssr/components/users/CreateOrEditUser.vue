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
                    <v-text-field
                        v-model="formData.firstName"
                        :error-messages="firstNameErrors"
                        :rules="firstNameRules"
                        label="First name"
                        name="firstName"
                    />

                    <v-text-field
                        v-model="formData.lastName"
                        :error-messages="lastNameErrors"
                        :rules="lastNameRules"
                        label="Last name"
                        name="lastName"
                    />

                    <v-text-field
                        v-model="formData.email"
                        :error-messages="emailErrors"
                        :rules="emailRules"
                        label="Email"
                        name="email"
                    />

                    <v-text-field
                        v-if="!selectedItem"
                        v-model="formData.password"
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :error-messages="passwordErrors"
                        :rules="passwordRules"
                        :type="showPassword ? 'text' : 'password'"
                        label="Password"
                        name="password"
                        @click:append="showPassword = !showPassword"
                    />

                    <v-text-field
                        v-model="formData.birthDate"
                        type="date"
                        :error-messages="birthDateErrors"
                        :rules="birthDateRules"
                        label="Date of Birth"
                        name="birthday"
                    />

                    <v-card-actions class="d-flex justify-center">
                        <v-btn
                            outlined
                            class="elevation-1"
                            color="primary"
                            type="submit"
                            data-cy="submit-button"
                        >
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
import createOrEditValidator from '~/validators/users/createOrEditValidator.mixin';

export default {
    mixins: [createOrEditValidator],
    props: {
        selectedItem: Object,
        showCreateOrEditModal: Boolean
    },
    data() {
        const defaultFormData = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            birthDate: ''
        };

        return {
            defaultFormData,
            formData: { ...defaultFormData },
            showPassword: false,
            isModalShown: this.showCreateOrEditModal
        };
    },
    created() {
        this.setDefaultFormData();

        if (!this.selectedItem) {
            return;
        }

        this.formData = {
            ...this.selectedItem
        };
    },
    methods: {
        ...mapActions('users', ['saveUser']),

        async submit() {
            this.$v.$touch();

            if (this.$v.$invalid) {
                return;
            }

            try {
                await this.saveUser(this.formData);
                this.onClose();

                this.$notify({
                    title: 'Created',
                    text: 'New user has been created',
                    type: 'success'
                });
            } catch (error) {
                console.error(error);
                this.checkErrorResponse(error);

                this.$notify({
                    text: error,
                    type: 'error'
                });
            }
        },

        formTitle() {
            return !this.selectedItem ? 'New employee' : 'Edit employee';
        },

        onClose() {
            this.$v.$reset();
            this.setDefaultFormData();
            this.$emit('close-modal');
        },

        setDefaultFormData() {
            this.formData = { ...this.defaultFormData };
            this.serverErrors = [];
        }
    }
};
</script>
