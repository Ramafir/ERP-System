import {
    email,
    maxLength,
    minLength,
    required,
    helpers
} from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
import abstractValidator from '@/validators/abstractValidator.mixin';

export default {
    mixins: [validationMixin, abstractValidator],
    data() {
        return {
            emailRules: [
                value => !!value || 'Email is required',
                value =>
                    (!!value && value.length < 254) ||
                    'Email length must be maximum 254 characters long',
                value =>
                    (!!value && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) ||
                    'Must be valid e-mail'
            ],
            passwordRules: [
                value => !!value || 'Password is required',
                value =>
                    (!!value && value.length >= 8 && value.length <= 254) ||
                    'Password length must be between 8 and 254',
                value =>
                    (value &&
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                            value
                        )) ||
                    'Min. 8 characters with at least one capital letter, a number and a special character.'
            ],
            serverErrors: []
        };
    },
    validations() {
        return {
            formData: {
                email: {
                    required,
                    email,
                    max: maxLength(254)
                },
                password: {
                    required,
                    min: minLength(8),
                    max: maxLength(254),
                    containsPasswordRequirement: helpers.regex(
                        'password',
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                    )
                }
            }
        };
    },
    computed: {
        emailErrors() {
            const errors = [];

            if (!this.$v.formData.email.$dirty) {
                return errors;
            }

            if (!this.serverErrors) {
                return;
            }

            this.serverErrors.map(
                err => err.param === 'email' && errors.push(err.message)
            );
            !this.$v.formData.email.email &&
                errors.push('Must be valid e-mail');
            !this.$v.formData.email.required &&
                errors.push('E-mail is required');

            return errors;
        },

        passwordErrors() {
            const errors = [];

            if (!this.$v.formData.password.$dirty) {
                return errors;
            }

            if (!this.serverErrors) {
                return;
            }

            this.serverErrors.map(
                err => err.param === 'password' && errors.push(err.message)
            );
            !this.$v.formData.password.containsPasswordRequirement &&
                errors.push(
                    'Min. 8 characters with at least one capital letter, a number and a special character'
                );
            !this.$v.formData.password.min &&
                !this.$v.formData.password.max &&
                errors.push('Password length must be between 8 and 254');
            !this.$v.formData.password.required &&
                errors.push('Password is required');

            return errors;
        }
    }
};
