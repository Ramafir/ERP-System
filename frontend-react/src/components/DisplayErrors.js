import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage } from 'formik';

const DisplayErrors = ({ error, name }) => {
    return (
        <div className="text-red-600 m-0">
            {error || <ErrorMessage name={name} component="div" />}
        </div>
    );
};

DisplayErrors.propTypes = {
    error: PropTypes.string,
    name: PropTypes.string
};

export default DisplayErrors;
