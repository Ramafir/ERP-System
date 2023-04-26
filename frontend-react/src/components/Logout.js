import { useDispatch } from 'react-redux';
import { logout } from '@/store/auth/authSlice';

const Logout = () => {
    const dispatch = useDispatch();

    const logOut = () => {
        dispatch(logout());
    };

    return (
        <button
            className="cursor-pointer mx-4 px-4 rounded-md hover:bg-gray-800"
            type="button"
            onClick={logOut}
        >
            Logout
        </button>
    );
};

export default Logout;
