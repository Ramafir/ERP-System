import PropTypes from 'prop-types';

const DefaultLayout = ({ children }) => {
    return (
        <div className="w-full bg-neutral-200 h-screen flex items-center justify-center">
            {children}
        </div>
    );
};

DefaultLayout.propTypes = {
    children: PropTypes.any
};

export default DefaultLayout;
