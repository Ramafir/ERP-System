import * as Yup from 'yup';

const CreateOrEditUserValidation = user =>
    Yup.object({
        firstName: Yup.string()
            .required('First name is required')
            .min(2, 'First name must be minimum 2 characters long')
            .max(
                60,
                'The field must contain at least 2 characters (can not exceed 60 characters).'
            ),
        lastName: Yup.string()
            .required('Last name is required')
            .min(2, 'Last name must be minimum 2 characters long')
            .max(
                60,
                'The field must contain at least 2 characters (can not exceed 60 characters).'
            ),
        email: Yup.string()
            .required('Email is required')
            .email('Email is not valid')
            .max(254, 'Email length must be maximum 254 characters long'),
        password: Yup.string()
            .test('', 'Password is required', password => {
                if (user === null && password === undefined) {
                    return false;
                }

                if (user !== null || password !== undefined) {
                    return true;
                }
            })
            .min(8)
            .max(254)
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                'Min. 8 characters with at least one capital letter, a number and a special character.'
            ),

        birthDate: Yup.string().required('Birth date is required')
    });

export default CreateOrEditUserValidation;
