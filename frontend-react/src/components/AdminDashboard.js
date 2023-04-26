import React from 'react';
import PropTypes from 'prop-types';

const AdminDashboard = ({ users, page }) => {
    return (
        <div className="text-black">
            <h1 className="font-bold text-4xl mx-10 mt-4">Admin Dashboard</h1>
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
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        {user.vacationDaysTotal}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        {user.vacationDaysTaken}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

AdminDashboard.propTypes = {
    users: PropTypes.array,
    page: PropTypes.number
};

export default AdminDashboard;
