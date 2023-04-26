import {
    email,
    helpers,
    maxLength,
    minLength,
    required,
    requiredIf
} from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
import abstractValidator from '@/validators/abstractValidator.mixin';

export default {
    mixins: [validationMixin, abstractValidator],
    data() {
        return {
            firstNameRules: [
                value => !!value || 'First name is required',
                value =>
                    (value && value.length >= 2) ||
                    'First name must be minimum 2 characters long'
            ],
            lastNameRules: [
                value => !!value || 'Last name is required',
                value =>
                    (value && value.length >= 2) ||
                    'Last name must be minimum 2 characters long'
            ],
            birthDateRules: [value => !!value || 'Birth date is required'],
            emailRules: [
                value => !!value || 'Email is required',
                value =>
                    (value && value.length < 254) ||
                    'Email length must be maximum 254 characters long',
                value =>
                    (value && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) ||
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
                firstName: {
                    required,
                    min: minLength(2)
                },
                lastName: {
                    required,
                    min: minLength(2)
                },
                birthDate: {
                    required
                },
                email: {
                    required,
                    email,
                    max: maxLength(254)
                },
                password: {
                    required: requiredIf(function () {
                        return !this.selectedItem;
                    }),
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
        firstNameErrors() {
            const errors = [];

            if (!this.$v.formData.firstName.$dirty) {
                return errors;
            }

            this.serverErrors.map(
                err => err.param === 'firstName' && errors.push(err.message)
            );
            !this.$v.formData.firstName.min &&
                errors.push('First name must be minimum 2 characters long');
            !this.$v.formData.firstName.required &&
                errors.push('First name is required');

            return errors;
        },
        lastNameErrors() {
            const errors = [];

            if (!this.$v.formData.lastName.$dirty) {
                return errors;
            }

            this.serverErrors.map(
                err => err.param === 'lastName' && errors.push(err.message)
            );
            !this.$v.formData.lastName.min &&
                errors.push('Last name must be minimum 2 characters long');
            !this.$v.formData.lastName.required &&
                errors.push('Last name is required');

            return errors;
        },
        birthDateErrors() {
            const errors = [];

            if (!this.$v.formData.birthDate.$dirty) {
                return errors;
            }

            this.serverErrors.map(
                err => err.param === 'birthDate' && errors.push(err.message)
            );
            !this.$v.formData.birthDate.required &&
                errors.push('Birth date is required');

            return errors;
        },
        emailErrors() {
            const errors = [];

            if (!this.$v.formData.email.$dirty) {
                return errors;
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
