import PropTypes from 'prop-types';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

const LoggedLayout = ({ children }) => {
    return (
        <div className="w-full bg-neutral-200 h-screen flex">
            <Navbar />
            <div className="mt-14 flex w-full">
                <Sidebar />
                <div className="grid grid-cols-10 gap-3 w-full">
                    <div className="col-span-10">{children}</div>
                </div>
            </div>
        </div>
    );
};

LoggedLayout.propTypes = {
    children: PropTypes.any
};

export default LoggedLayout;
