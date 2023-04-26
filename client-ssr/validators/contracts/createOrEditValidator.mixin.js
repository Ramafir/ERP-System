import { integer, minLength, required } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';
import abstractValidator from '@/validators/abstractValidator.mixin';

export default {
    mixins: [validationMixin, abstractValidator],
    data() {
        return {
            userIdRules: [
                value => !!value || 'User ID is required',
                value =>
                    !!value ||
                    (value.id &&
                        /^[\da-f]{8}-[\da-f]{4}-[0-5][\da-f]{3}-[089ab][\da-f]{3}-[\da-f]{12}$/i.test(
                            value.id
                        )) ||
                    'Must be a valid UUID.'
            ],
            startDateRules: [value => !!value || 'Start date is required'],
            durationRules: [
                value => !!value || 'Duration is required',
                value =>
                    Number.isInteger(Number(value)) || 'Should be integer type'
            ],
            vacationsPerYearRules: [
                value => !!value || 'Vacations per year is required',
                value =>
                    Number.isInteger(Number(value)) || 'Should be integer type'
            ],
            jobPositionRules: [
                value => !!value || 'Job title is required',
                value =>
                    (value && value.length >= 2) ||
                    'Job title must be minimum 2 characters long'
            ],
            serverErrors: []
        };
    },
    validations() {
        return {
            formData: {
                userId: {
                    required
                },
                startDate: {
                    required
                },
                duration: {
                    integer,
                    required
                },
                vacationsPerYear: {
                    required,
                    integer
                },
                jobPosition: {
                    required,
                    minLength: minLength(2)
                }
            }
        };
    },
    computed: {
        userIdErrors() {
            const errors = [];

            if (!this.$v.formData.userId.$dirty) {
                return errors;
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

            this.serverErrors.map(
                err => err.param === 'startDate' && errors.push(err.message)
            );
            !this.$v.formData.startDate.required &&
                errors.push('Start date is required');

            return errors;
        },
        durationErrors() {
            const errors = [];

            if (!this.$v.formData.duration.$dirty) {
                return errors;
            }

            this.serverErrors.map(
                err => err.param === 'duration' && errors.push(err.message)
            );
            !this.$v.formData.duration.required &&
                errors.push('Duration is required');
            !this.$v.formData.duration.integer &&
                errors.push('Should be integer type');

            return errors;
        },
        vacationsPerYearErrors() {
            const errors = [];

            if (!this.$v.formData.vacationsPerYear.$dirty) {
                return errors;
            }

            this.serverErrors.map(
                err =>
                    err.param === 'vacationsPerYear' && errors.push(err.message)
            );
            !this.$v.formData.vacationsPerYear.integer &&
                errors.push('Should be integer type');
            !this.$v.formData.vacationsPerYear.required &&
                errors.push('Vacations per year is required');

            return errors;
        },

        jobPositionErrors() {
            const errors = [];

            if (!this.$v.formData.jobPosition.$dirty) {
                return errors;
            }

            this.serverErrors.map(
                err => err.param === 'jobPosition' && errors.push(err.message)
            );
            !this.$v.formData.jobPosition.minLength &&
                errors.push('Job position must have more than 2 characters');
            !this.$v.formData.jobPosition.required &&
                errors.push('Job position is required');

            return errors;
        }
    }
};
