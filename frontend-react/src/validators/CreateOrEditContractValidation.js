import * as Yup from 'yup';

const CreateOrEditContractValidation = () =>
    Yup.object({
        userId: Yup.string()
            .required('User ID is required')
            .matches(
                /^[\da-f]{8}-[\da-f]{4}-[0-5][\da-f]{3}-[089ab][\da-f]{3}-[\da-f]{12}$/i,
                'Must be a valid UUID.'
            ),
        jobPosition: Yup.string().required('Job title is required'),
        startDate: Yup.string()
            .required('Start date is required')
            .matches(
                /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
                'The format of date is not correct'
            ),
        duration: Yup.number().required('Duration is required'),
        vacationsPerYear: Yup.number()
            .required('Field is required')
            .test('', 'It can be only 20 or 26 days', value => {
                return value === 20 || value === 26;
            })
    });

export default CreateOrEditContractValidation;
