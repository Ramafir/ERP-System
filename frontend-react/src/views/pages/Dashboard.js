import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { index } from '@/store/user/userSlice';
import LoggedLayout from '../layouts/LoggedLayout';
import UserDashboard from '@/components/UserDashboard';
import AdminDashboard from '@/components/AdminDashboard';

const Dashboard = () => {
    const dispatch = useDispatch();

    const { isAdmin } = useSelector(state => state.auth);
    const { users } = useSelector(state => state.user);
    const [currentPage] = useState(1);

    useEffect(() => {
        if (isAdmin) {
            dispatch(index());
        }
    }, []);

    return (
        <LoggedLayout>
            {!isAdmin ? (
                <UserDashboard />
            ) : (
                <div className="text-black">
                    <AdminDashboard users={users} page={currentPage} />
                </div>
            )}
        </LoggedLayout>
    );
};

export default Dashboard;
