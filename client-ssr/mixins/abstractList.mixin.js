export default {
    props: {
        count: {
            type: Number,
            required: false,
            default: 0
        }
    },

    data() {
        return {
            params: {
                page: 1,
                perPage: null
            }
        };
    },

    methods: {
        onUpdateTable({ itemsPerPage, page }) {
            this.params.perPage = itemsPerPage;
            this.params.page = page;
        }
    }
};
