<template>
    <v-container bg fill-height grid-list-md text-xs-center class="mt-16">
        <v-layout row wrap align-center>
            <v-flex>
                <v-form @submit.prevent="handleSubmit">
                    <v-card width="600" class="mx-auto mt-9">
                        <v-card-title class="justify-center">
                            ERP System
                        </v-card-title>
                        <v-card-text>
                            <v-text-field
                                v-model="formData.email"
                                name="email"
                                label="Email"
                                :error-messages="emailErrors"
                                :rules="emailRules"
                                type="email"
                                prepend-icon="mdi-email"
                                outlined
                                required
                            />
                            <v-text-field
                                v-model="formData.password"
                                name="password"
                                label="Password"
                                :error-messages="passwordErrors"
                                :rules="passwordRules"
                                :type="showPassword ? 'text' : 'password'"
                                prepend-icon="mdi-lock"
                                :append-icon="
                                    showPassword ? 'mdi-eye' : 'mdi-eye-off'
                                "
                                outlined
                                required
                                @click:append="showPassword = !showPassword"
                            />
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-btn
                                type="submit"
                                color="blue-grey lighten-5"
                                outlined
                            >
                                <span v-if="loading"> Loading...</span>
                                <span v-if="!loading"> Login</span></v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import userLoginValidator from '~/validators/auth/userLoginValidator.mixin';

export default {
    mixins: [userLoginValidator],
    data() {
        const defaultFormData = {
            email: '',
            password: ''
        };
        return {
            defaultFormData,
            loading: false,
            showPassword: false,
            formData: { ...defaultFormData }
        };
    },
    methods: {
        ...mapActions(['login']),

        async handleSubmit() {
            this.loading = true;
            this.$v.$touch();

            if (this.$v.$invalid) {
                this.loading = false;

                return;
            }

            try {
                await this.login(this.formData);
                this.loading = false;
                await this.$router.replace('/dashboard');

                this.$notify({
                    title: 'Authorization',
                    text: 'You have been logged in!',
                    type: 'success'
                });
            } catch (error) {
                console.error(error);
                this.checkErrorResponse(error);

                this.$notify({
                    title: 'Authorization',
                    text: error,
                    type: 'error'
                });
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>
