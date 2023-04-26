import React from 'react';
import PropTypes from 'prop-types';

const UserList = ({
    users,
    setSelectedUser,
    setIsCreateOrEditUserDialogOpen,
    setIsDeleteDialogOpen,
    page
}) => {
    const edit = user => {
        setSelectedUser(user);
        setIsCreateOrEditUserDialogOpen(true);
    };

    const destroy = user => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                                First name
                            </th>
                            <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                                Last name
                            </th>
                            <th
                                scope="col"
                                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                            >
                                Email
                            </th>
                            <th
                                scope="col"
                                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                            >
                                Date of birth
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                Vacation days total
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                Vacation days taken
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {users[page]?.map(user => (
                            <tr key={user.id}>
                                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                                    {user.firstName}
                                </td>
                                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                                    {user.lastName}
                                </td>
                                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                                    {user.email}
                                </td>
                                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                                    {user.birthDate}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500">
                                    {user.vacationDaysTotal}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500">
                                    {user.vacationDaysTaken}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500">
                                    <button
                                        className="bg-blue-900 hover:bg-gray-800 text-white h-6 w-16 rounded-lg font-semibold mr-4"
                                        onClick={() => edit(user)}
                                    >
                                        EDIT
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-gray-800 text-white h-6 w-20 rounded-lg font-semibold"
                                        onClick={() => destroy(user)}
                                    >
                                        DELETE
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

UserList.propTypes = {
    users: PropTypes.array,
    setSelectedUser: PropTypes.func,
    setIsCreateOrEditUserDialogOpen: PropTypes.func,
    setIsDeleteDialogOpen: PropTypes.func,
    page: PropTypes.number
};

export default UserList;
