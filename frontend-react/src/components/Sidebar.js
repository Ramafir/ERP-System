import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    HomeIcon,
    UserGroupIcon,
    DocumentTextIcon,
    GlobeEuropeAfricaIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
    const isAdmin = useSelector(state => state.auth.isAdmin);

    return (
        <div className="flex">
            <div className="flex flex-col p-3 bg-blue-900 w-60">
                <div className="space-y-3">
                    <div className="flex-1">
                        <ul className="pt-2 pb-4 space-y-1 text-sm">
                            <li className="rounded-sm">
                                <Link
                                    to="/"
                                    className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-800 text-white"
                                >
                                    <HomeIcon className="h-8 w-8" />
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            {isAdmin && (
                                <li className="rounded-sm">
                                    <Link
                                        to="/users"
                                        className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-800 text-white"
                                    >
                                        <UserGroupIcon className="h-8 w-8" />
                                        <span>Employees</span>
                                    </Link>
                                </li>
                            )}
                            <li className="rounded-sm">
                                <Link
                                    to="/contracts"
                                    className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-800 text-white"
                                >
                                    <DocumentTextIcon className="h-8 w-8" />
                                    <span>Contracts</span>
                                </Link>
                            </li>
                            <li className="rounded-sm">
                                <Link
                                    to="/vacations"
                                    className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-800 text-white"
                                >
                                    <GlobeEuropeAfricaIcon className="h-8 w-8" />
                                    <span>Vacations</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
