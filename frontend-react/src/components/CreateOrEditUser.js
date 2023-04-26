import dayjs from 'dayjs';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DisplayErrors from './DisplayErrors';
import { update, store, clearServerErrors } from '@/store/user/userSlice';
import CreateOrEditUserValidation from '@/validators/CreateOrEditUserValidation';

const CreateOrEditUser = ({
    isCreateOrEditUserDialogOpen,
    setIsCreateOrEditUserDialogOpen,
    selectedUser
}) => {
    const defaultFormData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        birthDate: ''
    };
    const dispatch = useDispatch();
    const { errors, isSuccess, users } = useSelector(state => state.user);
    const [formData, setFormData] = useState(defaultFormData);

    useEffect(() => {
        if (isSuccess) {
            close();
        }
    }, [users]);

    const saveUser = async formData => {
        if (formData.id) {
            dispatch(update(formData));
        } else {
            dispatch(store(formData));
        }
    };

    const close = () => {
        setIsCreateOrEditUserDialogOpen(false);
        setFormData(defaultFormData);
        dispatch(clearServerErrors());
    };

    const onDateChange = (setFieldValue, name, date) => {
        setFieldValue(name, dayjs(date).format('YYYY-MM-DD'));
    };

    const isValid = date => {
        return dayjs().isAfter(dayjs(date));
    };

    return (
        <div>
            {isCreateOrEditUserDialogOpen && (
                <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                    <div className="relative p-4 w-full max-w-lg h-full md:h-auto">
                        <div className="relative bg-white rounded-lg shadow dark:bg-stone-200">
                            <div className="flex justify-between items-center p-5 rounded-t border-b">
                                <h3 className="text-xl font-medium text-gray-900">
                                    {selectedUser ? 'Edit user' : 'Create user'}
                                </h3>
                            </div>
                            <Formik
                                initialValues={selectedUser || formData}
                                validationSchema={CreateOrEditUserValidation(
                                    selectedUser
                                )}
                                onSubmit={formData => saveUser(formData)}
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
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                                    First name
                                                </label>
                                                <input
                                                    name="firstName"
                                                    type="text"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    value={values.firstName}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <DisplayErrors
                                                error={errors?.firstName}
                                                name="firstName"
                                            />
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                                    Last name
                                                </label>
                                                <input
                                                    name="lastName"
                                                    type="text"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    value={values.lastName}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <DisplayErrors
                                                error={errors?.lastName}
                                                name="lastName"
                                            />
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                                    Email
                                                </label>
                                                <input
                                                    name="email"
                                                    type="email"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    value={values.email}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <DisplayErrors
                                                error={errors?.email}
                                                name="email"
                                            />
                                            {!selectedUser && (
                                                <div>
                                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                                        Password
                                                    </label>
                                                    <input
                                                        name="password"
                                                        type="password"
                                                        value={values.password}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            )}
                                            <DisplayErrors
                                                error={errors?.password}
                                                name="password"
                                            />
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                                    Date of birth
                                                </label>
                                                <Datetime
                                                    inputProps={{
                                                        className:
                                                            'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                                                    }}
                                                    className="text-gray-900"
                                                    dateFormat="YYYY-MM-DD"
                                                    timeFormat={false}
                                                    value={values.birthDate}
                                                    isValidDate={isValid}
                                                    closeOnSelect
                                                    onBlur={handleBlur}
                                                    onChange={date =>
                                                        onDateChange(
                                                            setFieldValue,
                                                            'birthDate',
                                                            date
                                                        )
                                                    }
                                                />
                                            </div>
                                            <DisplayErrors
                                                error={errors?.birthDate}
                                                name="birthDate"
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
                                                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
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

CreateOrEditUser.propTypes = {
    isCreateOrEditUserDialogOpen: PropTypes.bool,
    setIsCreateOrEditUserDialogOpen: PropTypes.func,
    selectedUser: PropTypes.object
};

export default CreateOrEditUser;
