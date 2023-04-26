import React from 'react';
import { useSelector } from 'react-redux';
import Logout from '@/components/Logout';

const Navbar = () => {
    const { user } = useSelector(state => state.auth);

    return (
        <div className="w-full fixed top-0 left-0 border-b-slate-700">
            <div className="md:flex bg-blue-900 py-4">
                <div className="w-full flex justify-between">
                    <div className="pl-20 text-white text-2xl">ERP System</div>
                    <div className="text-white">
                        {user && user.email}
                        <Logout />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
