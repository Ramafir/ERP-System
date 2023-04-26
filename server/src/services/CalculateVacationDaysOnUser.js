class CalculateVacationDaysOnUser {
    async create(employee, vacationDaysToDeduct, transaction) {
        const newVacationDaysTaken =
            employee.vacationDaysTaken + vacationDaysToDeduct;

        await employee.update(
            {
                vacationDaysTaken: newVacationDaysTaken
            },
            { transaction }
        );
    }

    async update(employee, vacation, vacationDaysToDeduct, transaction) {
        const oldVacationDaysTaken =
            employee.vacationDaysTaken - vacation.duration;

        const newVacationDaysTaken =
            oldVacationDaysTaken + vacationDaysToDeduct;

        await employee.update(
            {
                vacationDaysTaken: newVacationDaysTaken
            },
            { transaction }
        );
    }

    async delete(employee, vacation, transaction) {
        const newVacationDaysTaken =
            employee.vacationDaysTotal - vacation.duration;

        await employee.update(
            {
                vacationDaysTaken: newVacationDaysTaken
            },
            { transaction }
        );
    }
}

module.exports = CalculateVacationDaysOnUser;
