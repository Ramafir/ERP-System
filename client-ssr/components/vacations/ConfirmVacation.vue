<template>
    <v-dialog
        v-model="isModalShown"
        persistent
        scrollable
        height="500"
        width="500"
    >
        <v-card class="pa-3">
            <v-card-title> Are you sure? </v-card-title>

            <v-divider />

            <v-card-text class="mt-6">
                Are you sure you want to confirm this vacation?
            </v-card-text>

            <v-divider />

            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" outlined @click="onCancel">
                    cancel
                </v-btn>
                <v-btn color="error" outlined @click="onConfirm">
                    confirm
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        showConfirmVacation: Boolean,
        selectedItem: Object
    },
    data() {
        return {
            isModalShown: this.showConfirmVacation
        };
    },
    methods: {
        onConfirm() {
            this.$emit('confirmed');
        },
        onCancel() {
            this.$emit('canceled');
        }
    }
};
</script>
