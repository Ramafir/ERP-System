import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Autocomplete, TextField } from '@mui/material';

import { searchQuery } from '@/store/user/userSlice';

const UserSearchBar = ({ setFieldValue, selected }) => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [selectedUserInInput] = useState(
        selected && {
            fullName: selected.user.fullName,
            id: selected.userId
        }
    );

    const query = async searchText => {
        const { payload } = await dispatch(searchQuery(searchText));

        setUsers(payload);
    };

    return (
        <Autocomplete
            defaultValue={selectedUserInInput}
            options={users}
            getOptionLabel={option => option.fullName || ''}
            renderInput={params => (
                <TextField
                    {...params}
                    name="userId"
                    onChange={e => {
                        query(e.target.value);
                    }}
                    sx={{ input: { color: 'black' } }}
                    className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                />
            )}
            onChange={(_, selectedUser) => {
                if (selectedUser) {
                    setFieldValue('userId', selectedUser.id);
                }
            }}
        />
    );
};

UserSearchBar.propTypes = {
    setFieldValue: PropTypes.func,
    selected: PropTypes.object
};

export default UserSearchBar;
