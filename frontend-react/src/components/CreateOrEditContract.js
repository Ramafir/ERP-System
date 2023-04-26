import dayjs from 'dayjs';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    store,
    update,
    clearServerErrors
} from '@/store/contract/contractSlice';
import UserSearchBar from './UserSearchBar';
import DisplayErrors from './DisplayErrors';
import CreateOrEditContractValidation from '@/validators/CreateOrEditContractValidation';

const CreateOrEditContract = ({
    isCreateOrEditContractDialogOpen,
    setIsCreateOrEditContractDialogOpen,
    selectedContract
}) => {
    const dispatch = useDispatch();
    const { errors, isSuccess, contracts } = useSelector(
        state => state.contract
    );

    const defaultFormData = {
        userId: null,
        startDate: new Date().toISOString().slice(0, 10),
        jobPosition: '',
        duration: '',
        vacationsPerYear: ''
    };

    const [formData, setFormData] = useState(defaultFormData);

    useEffect(() => {
        if (isSuccess) {
            close();
        }
    }, [contracts]);

    const saveContract = formData => {
        if (formData.id) {
            dispatch(update(formData));
        } else {
            dispatch(store(formData));
        }
    };

    const close = () => {
        setIsCreateOrEditContractDialogOpen(false);
        setFormData(defaultFormData);
        dispatch(clearServerErrors());
    };

    const onDateChange = (setFieldValue, name, date) => {
        setFieldValue(name, dayjs(date).format('YYYY-MM-DD'));
    };

    return (
        <div>
            {isCreateOrEditContractDialogOpen && (
                <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <div className="relative p-4 w-full max-w-lg h-full md:h-auto">
                        <div className="relative bg-white rounded-lg shadow dark:bg-stone-200">
                            <div className="flex justify-between items-center p-5 rounded-t border-b dark:border-gray-600">
                                <h3 className="text-xl font-medium text-gray-900">
                                    {selectedContract
                                        ? 'Edit contract'
                                        : 'Create contract'}
                                </h3>
                            </div>
                            <Formik
                                initialValues={selectedContract || formData}
                                validationSchema={
                                    CreateOrEditContractValidation
                                }
                                onSubmit={formData => saveContract(formData)}
                            >
                                {({
                                    values,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    setFieldValue
                                }) => (
                                    <form onSubmit={handleSubmit}>
                                        <div className="p-6 space-y-2">
                                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                                Search employee
                                            </label>
                                            <UserSearchBar
                                                setFieldValue={setFieldValue}
                                                selected={selectedContract}
                                            />
                                            <DisplayErrors
                                                error={errors?.userId}
                                                name="userId"
                                            />
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                                    Job title
                                                </label>
                                                <input
                                                    name="jobPosition"
                                                    type="text"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    value={values.jobPosition}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <DisplayErrors
                                                error={errors?.jobPosition}
                                                name="jobPosition"
                                            />
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                                    Start date
                                                </label>
                                                <Datetime
                                                    inputProps={{
                                                        className:
                                                            'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                                                    }}
                                                    className="text-gray-900"
                                                    dateFormat="YYYY-MM-DD"
                                                    timeFormat={false}
                                                    value={values.startDate}
                                                    closeOnSelect
                                                    onBlur={handleBlur}
                                                    onChange={date =>
                                                        onDateChange(
                                                            setFieldValue,
                                                            'startDate',
                                                            date
                                                        )
                                                    }
                                                    onClose={() => {
                                                        if (
                                                            values.startDate >=
                                                            values.endDate
                                                        ) {
                                                            setFieldValue(
                                                                'endDate',
                                                                values.startDate
                                                            );
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <DisplayErrors
                                                error={errors?.startDate}
                                                name="startDate"
                                            />
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                                    Duration
                                                </label>
                                                <input
                                                    name="duration"
                                                    type="text"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    value={values.duration}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                                <DisplayErrors
                                                    error={errors?.duration}
                                                    name="duration"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="vacationsPerYear"
                                                    className="block mb-2 text-sm font-medium text-gray-900"
                                                >
                                                    Vacation days per year
                                                </label>
                                                <input
                                                    name="vacationsPerYear"
                                                    type="number"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    value={
                                                        values.vacationsPerYear
                                                    }
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <DisplayErrors
                                                error={errors?.vacationsPerYear}
                                                name="vacationsPerYear"
                                            />
                                        </div>
                                        <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600 justify-end">
                                            <button
                                                type="submit"
                                                className="text-white bg-blue-900 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                className="bg-red-500 hover:bg-gray-800 text-white focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-white focus:z-10"
                                                onClick={close}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

CreateOrEditContract.propTypes = {
    isCreateOrEditContractDialogOpen: PropTypes.bool,
    setIsCreateOrEditContractDialogOpen: PropTypes.func,
    selectedContract: PropTypes.object
};

export default CreateOrEditContract;
