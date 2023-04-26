import abstractListMixin from '../abstractList.mixin';

export default {
    mixins: [abstractListMixin],

    props: {
        users: {
            type: Array,
            required: true
        }
    },

    watch: {
        params: {
            handler(params) {
                this.$emit('index-users', params);
            },
            deep: true
        }
    }
};
