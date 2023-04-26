import * as Yup from 'yup';

const LoginValidation = Yup.object({
    email: Yup.string()
        .required('Email is required')
        .email('Must be a valid email')
        .max(254, 'Email length must be maximum 254 characters long'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password length must be between 8 and 254')
        .max(254, 'Password length must be between 8 and 254).')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Min. 8 characters with at least one capital letter, a number and a special character.'
        )
});

export default LoginValidation;
