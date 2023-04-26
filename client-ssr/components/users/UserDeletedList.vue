<template>
    <user-list
        :users="users"
        :count="count"
        :page="params.page"
        v-on="$listeners"
        @update-table="onUpdateTable"
    />
</template>

<script>
import UserList from '~/components/users/UserList';
import userListMixin from '~/mixins/users/userList.mixin';

export default {
    components: { UserList },
    mixins: [userListMixin],

    data() {
        return {
            params: {
                deleted: true
            }
        };
    }
};
</script>
