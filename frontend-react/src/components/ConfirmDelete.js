import React from 'react';
import PropTypes from 'prop-types';

const ConfirmDelete = ({
    confirm,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen
}) => {
    return (
        <div>
            {isDeleteDialogOpen && (
                <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="fixed inset-0 bg-stone-200 bg-opacity-75 transition-opacity"></div>
                    <div className="relative p-4 w-full max-w-lg h-full md:h-auto">
                        <div className="relative bg-white rounded-lg shadow dark:bg-stone-100">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Delete
                                </h3>
                            </div>
                            <div className="mt-2 ml-5 max-w-xl text-sm text-gray-600">
                                <p>
                                    Are you sure you want to delete this item?
                                </p>
                            </div>
                            <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600 justify-end">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                                    onClick={confirm}
                                >
                                    Confirm
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-900 px-4 py-2 font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

ConfirmDelete.propTypes = {
    confirm: PropTypes.func,
    setIsDeleteDialogOpen: PropTypes.func,
    isDeleteDialogOpen: PropTypes.bool
};

export default ConfirmDelete;
