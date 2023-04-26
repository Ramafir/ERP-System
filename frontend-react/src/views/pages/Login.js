import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { login } from '@/store/auth/authSlice';
import DisplayErrors from '@/components/DisplayErrors';
import DefaultLayout from '@/views/layouts/DefaultLayout';
import LoginValidation from '@/validators/LoginValidation';

const Login = () => {
    const dispatch = useDispatch();
    const { errors, isLogged } = useSelector(state => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLogged) {
            navigate('/');
        }
    }, [isLogged]);

    return (
        <DefaultLayout>
            <div className="w-full">
                <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <img
                            className="mx-auto h-12 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt="ERP System"
                        />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={LoginValidation}
                        onSubmit={values => dispatch(login(values))}
                    >
                        {({ handleChange, handleSubmit }) => (
                            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                                    <form
                                        className="space-y-6"
                                        onSubmit={handleSubmit}
                                    >
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Email address
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    autoComplete="email"
                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <DisplayErrors
                                                error={errors?.email}
                                                name="email"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="password"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Password
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    autoComplete="current-password"
                                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <DisplayErrors
                                                error={errors?.password}
                                                name="password"
                                            />
                                        </div>

                                        <div>
                                            <button className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                Sign in
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </Formik>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Login;
