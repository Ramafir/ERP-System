import { validationMixin } from 'vuelidate';

export default {
    mixins: [validationMixin],
    data() {
        return {};
    },
    methods: {
        checkErrorResponse(error) {
            if (!error.response) {
                return;
            }

            if (error.response.status === 500) {
                this.$notify({
                    text: 'We messed something up. Sorry!',
                    type: 'error'
                });
            }

            this.serverErrors = error.response.data.errors;
        }
    }
};
