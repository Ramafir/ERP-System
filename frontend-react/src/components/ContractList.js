import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const ContractsList = ({
    contracts,
    setSelectedContract,
    setIsCreateOrEditContractDialogOpen,
    setIsDeleteDialogOpen,
    page
}) => {
    const edit = contract => {
        setSelectedContract(contract);
        setIsCreateOrEditContractDialogOpen(true);
    };

    const { isAdmin } = useSelector(state => state.auth);

    const destroy = contract => {
        setSelectedContract(contract);
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
                                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                            >
                                Position
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
                                Vacation days
                            </th>
                            {isAdmin && (
                                <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {contracts[page]?.map(contract => (
                            <tr key={contract.id}>
                                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                                    {contract.user.fullName}
                                </td>
                                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                                    {contract.jobPosition}
                                </td>
                                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                                    {contract.startDate}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500">
                                    {contract.endDate}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500">
                                    {contract.availableDaysOffAmount}
                                </td>
                                {isAdmin && (
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        <button
                                            className="bg-blue-900 hover:bg-gray-800 text-white h-6 w-16 rounded-lg font-semibold mr-4"
                                            onClick={() => edit(contract)}
                                        >
                                            EDIT
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-gray-800 text-white h-6 w-20 rounded-lg font-semibold"
                                            onClick={() => destroy(contract)}
                                        >
                                            DELETE
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

ContractsList.propTypes = {
    contracts: PropTypes.array,
    setSelectedContract: PropTypes.func,
    setIsCreateOrEditContractDialogOpen: PropTypes.func,
    setIsDeleteDialogOpen: PropTypes.func,
    page: PropTypes.number
};

export default ContractsList;
