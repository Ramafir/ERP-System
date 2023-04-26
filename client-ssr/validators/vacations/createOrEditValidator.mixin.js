import { required, requiredIf } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
import { mapGetters } from 'vuex';
import abstractValidator from '@/validators/abstractValidator.mixin';

export default {
    mixins: [validationMixin, abstractValidator],
    data() {
        return {
            userIdRules: [
                value => !!value || 'User ID is required',
                value =>
                    (!!value &&
                        value.id &&
                        /^[\da-f]{8}-[\da-f]{4}-[0-5][\da-f]{3}-[089ab][\da-f]{3}-[\da-f]{12}$/i.test(
                            value.id
                        )) ||
                    'Must be a valid UUID.'
            ],
            startDateRules: [value => !!value || 'Start date is required'],
            endDateRules: [value => !!value || 'End date is required'],
            serverErrors: []
        };
    },
    validations() {
        return {
            formData: {
                userId: {
                    required: requiredIf(function () {
                        return this.isAdmin;
                    })
                },
                startDate: {
                    required
                },
                endDate: {
                    required
                }
            }
        };
    },
    computed: {
        ...mapGetters({ isAdmin: 'isAdmin' }),

        userIdErrors() {
            const errors = [];

            if (!this.$v.formData.userId.$dirty) {
                return errors;
            }

            if (!this.serverErrors) {
                return;
            }

            this.serverErrors.map(
                err => err.param === 'userId' && errors.push(err.message)
            );
            !this.$v.formData.userId.required &&
                errors.push('User ID is required');

            return errors;
        },

        startDateErrors() {
            const errors = [];

            if (!this.$v.formData.startDate.$dirty) {
                return errors;
            }

            if (!this.serverErrors) {
                return;
            }

            this.serverErrors.map(
                err => err.param === 'startDate' && errors.push(err.message)
            );
            !this.$v.formData.startDate.required &&
                errors.push('Start date is required');

            return errors;
        },

        endDateErrors() {
            const errors = [];

            if (!this.$v.formData.endDate.$dirty) {
                return errors;
            }

            if (!this.serverErrors) {
                return;
            }

            this.serverErrors.map(
                err =>
                    err.param === 'startDate' &&
                    err.message === 'There is existing vacation in this time' &&
                    errors.push(err.message)
            );

            this.serverErrors.map(
                err => err.param === 'endDate' && errors.push(err.message)
            );
            !this.$v.formData.endDate.required &&
                errors.push('End date is required');

            return errors;
        }
    }
};
