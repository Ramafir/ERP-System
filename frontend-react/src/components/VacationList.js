import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const VacationList = ({
    vacations,
    setIsDeleteDialogOpen,
    setSelectedVacation,
    setIsCreateOrEditVacationDialogOpen,
    approveVacation,
    page
}) => {
    const { isAdmin } = useSelector(state => state.auth);

    const edit = vacation => {
        setSelectedVacation(vacation);
        setIsCreateOrEditVacationDialogOpen(true);
    };

    const remove = vacation => {
        setSelectedVacation(vacation);
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
                                Full name
                            </th>

                            <th
                                scope="col"
                                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                            >
                                Start date
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                End date
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                Duration
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                Confirmed
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
                        {vacations[page]?.map(vacation => (
                            <tr key={vacation.id}>
                                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                                    {vacation.user.fullName}
                                </td>

                                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                                    {vacation.startDate}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500">
                                    {vacation.endDate}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500">
                                    {vacation.duration}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500">
                                    {vacation.confirmed ? (
                                        <CheckCircleIcon className="h-8 w-8 text-green-700" />
                                    ) : (
                                        <XMarkIcon className="h-8 w-8 text-red-600" />
                                    )}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500">
                                    <button
                                        className={
                                            vacation.confirmed
                                                ? 'bg-slate-300 h-6 w-20 rounded-lg font-semibold mr-4 text-slate-500'
                                                : 'bg-blue-900 hover:bg-gray-800 text-white h-6 w-20 rounded-lg font-semibold mr-4'
                                        }
                                        disabled={vacation.confirmed}
                                        onClick={() => edit(vacation)}
                                    >
                                        EDIT
                                    </button>
                                    <button
                                        className={
                                            vacation.confirmed
                                                ? 'bg-slate-300 h-6 w-20 rounded-lg font-semibold mr-4 text-slate-500'
                                                : 'bg-red-500 hover:bg-gray-800 text-white h-6 w-20 rounded-lg font-semibold mr-4'
                                        }
                                        disabled={vacation.confirmed}
                                        onClick={() => remove(vacation)}
                                    >
                                        DELETE
                                    </button>
                                    {!vacation.confirmed && isAdmin && (
                                        <button
                                            className="bg-green-700 hover:bg-gray-800 text-white h-6 w-24 rounded-lg font-semibold"
                                            onClick={() =>
                                                approveVacation(vacation)
                                            }
                                        >
                                            APPROVE
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

VacationList.propTypes = {
    vacations: PropTypes.array,
    setIsDeleteDialogOpen: PropTypes.func,
    setSelectedVacation: PropTypes.func,
    setIsCreateOrEditVacationDialogOpen: PropTypes.func,
    approveVacation: PropTypes.func,
    page: PropTypes.number
};

export default VacationList;
