import React from 'react';

import { useSelector } from 'react-redux';

const UserDashboard = () => {
    const { user } = useSelector(state => state.auth);

    const vacationDaysOff = user.vacationDaysTotal - user.vacationDaysTaken;

    return (
        <div>
            <h3 className="mt-5 ml-3 text-lg font-medium leading-6 text-gray-900">
                Information about your vacation days
            </h3>
            <dl className="mt-5 ml-3 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div
                    key={'Days of Vacation Left'}
                    className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
                >
                    <dt className="truncate text-sm font-medium text-gray-500">
                        {'Days of Vacation Left'}
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {vacationDaysOff}
                    </dd>
                </div>
                <div
                    key={'Days of Vacation Taken'}
                    className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
                >
                    <dt className="truncate text-sm font-medium text-gray-500">
                        {'Days of Vacation Taken'}
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {user.vacationDaysTaken}
                    </dd>
                </div>
            </dl>
        </div>
    );
};

export default UserDashboard;
