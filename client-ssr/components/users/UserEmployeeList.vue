<template>
    <user-list
        :users="users"
        :count="count"
        :page="params.page"
        :actions="{ edit: true, delete: true }"
        v-on="$listeners"
        @update-table="onUpdateTable"
    />
</template>

<script>
import userListMixin from '~/mixins/users/userList.mixin';
import UserList from '~/components/users/UserList';

export default {
    components: { UserList },
    mixins: [userListMixin]
};
</script>
