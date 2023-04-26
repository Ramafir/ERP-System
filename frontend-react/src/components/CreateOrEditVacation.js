import dayjs from 'dayjs';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import UserSearchBar from './UserSearchBar';
import DisplayErrors from './DisplayErrors';
import {
    store,
    update,
    clearServerErrors
} from '@/store/vacation/vacationSlice';
import CreateOrEditVacationValidation from '@/validators/CreateOrEditVacationValidation';

const CreateOrEditVacation = ({
    isCreateOrEditVacationDialogOpen,
    setIsCreateOrEditVacationDialogOpen,
    selectedVacation,
    setSelectedVacation
}) => {
    const defaultFormData = {
        userId: '',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10)
    };

    const dispatch = useDispatch();
    const [formData, setFormData] = useState(defaultFormData);
    const { isSuccess, vacations, errors } = useSelector(
        state => state.vacation
    );
    const { isAdmin } = useSelector(state => state.auth);

    useEffect(() => {
        if (isSuccess) {
            close();
        }
    }, [vacations]);

    const save = formData => {
        if (formData.id) {
            dispatch(update(formData));
        } else {
            dispatch(store(formData));
        }
    };

    const close = () => {
        setSelectedVacation(null);
        setFormData(defaultFormData);
        setIsCreateOrEditVacationDialogOpen(false);
        dispatch(clearServerErrors());
    };

    const isDateAllowed = val => {
        const allowedDay = new Date(val).getDay();

        return allowedDay !== 0 && allowedDay !== 6;
    };

    const onDateChange = (setFieldValue, name, date) => {
        setFieldValue(name, dayjs(date).format('YYYY-MM-DD'));
    };

    return (
        <div>
            {isCreateOrEditVacationDialogOpen && (
                <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <div className="relative p-4 w-full max-w-lg h-full md:h-auto">
                        <div className="relative bg-white rounded-lg shadow dark:bg-stone-200">
                            <div className="flex justify-between items-center p-5 rounded-t border-b dark:border-gray-600">
                                <h3 className="text-xl font-medium text-gray-900">
                                    {selectedVacation
                                        ? 'Edit vacation'
                                        : 'Create vacation'}
                                </h3>
                            </div>
                            <Formik
                                initialValues={selectedVacation || formData}
                                validationSchema={CreateOrEditVacationValidation(
                                    isAdmin
                                )}
                                onSubmit={formData => save(formData)}
                            >
                                {({
                                    values,
                                    handleBlur,
                                    handleSubmit,
                                    setFieldValue
                                }) => (
                                    <form onSubmit={handleSubmit}>
                                        <div className="p-6 space-y-2">
                                            {isAdmin && (
                                                <>
                                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                                        Search employee
                                                    </label>
                                                    <UserSearchBar
                                                        selected={
                                                            selectedVacation
                                                        }
                                                        setFieldValue={
                                                            setFieldValue
                                                        }
                                                    />
                                                    <DisplayErrors
                                                        error={errors?.userId}
                                                        name="userId"
                                                    />
                                                </>
                                            )}
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
                                                    isValidDate={isDateAllowed}
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
                                                <DisplayErrors
                                                    error={errors?.startDate}
                                                    name="startDate"
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                                    End date
                                                </label>
                                                <Datetime
                                                    inputProps={{
                                                        className:
                                                            'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                                                    }}
                                                    className="text-gray-900"
                                                    dateFormat="YYYY-MM-DD"
                                                    timeFormat={false}
                                                    value={values.endDate}
                                                    isValidDate={isDateAllowed}
                                                    closeOnSelect
                                                    onBlur={handleBlur}
                                                    onChange={date =>
                                                        onDateChange(
                                                            setFieldValue,
                                                            'endDate',
                                                            date
                                                        )
                                                    }
                                                />
                                                <DisplayErrors
                                                    error={errors?.endDate}
                                                    name="endDate"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600 justify-end">
                                            <button
                                                className="text-white bg-blue-900 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                                type="submit"
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="bg-red-500 hover:bg-gray-800 text-white focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-white focus:z-10"
                                                type="button"
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

CreateOrEditVacation.propTypes = {
    isCreateOrEditVacationDialogOpen: PropTypes.bool,
    setIsCreateOrEditVacationDialogOpen: PropTypes.func,
    setSelectedVacation: PropTypes.func,
    selectedVacation: PropTypes.object
};

export default CreateOrEditVacation;
