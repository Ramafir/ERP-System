import * as Yup from 'yup';

const CreateOrEditVacationValidation = isAdmin =>
    Yup.object({
        userId: Yup.string()
            .test('', 'User ID is required', userId => {
                if (!isAdmin) {
                    return true;
                }

                if (isAdmin && userId !== undefined) {
                    return true;
                }
            })
            .matches(
                /^[\da-f]{8}-[\da-f]{4}-[0-5][\da-f]{3}-[089ab][\da-f]{3}-[\da-f]{12}$/i,
                'Must be a valid UUID.'
            ),
        startDate: Yup.string()
            .required('Start date is required')
            .matches(
                /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
                'The format of date is not correct'
            ),
        endDate: Yup.string()
            .required('End date is required')
            .matches(
                /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
                'The format of date is not correct'
            )
    });

export default CreateOrEditVacationValidation;
