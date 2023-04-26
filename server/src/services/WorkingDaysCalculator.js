class WorkingDaysCalculator {
    constructor(dayjs) {
        this.dayjs = dayjs;
    }
    getBusinessDatesCount(startDate, endDate) {
        let count = 0;
        let currentDate = this.dayjs(startDate);

        while (this.dayjs(currentDate) <= this.dayjs(endDate)) {
            const dayOfWeek = this.dayjs(currentDate).get('day');
            const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;

            if (!isWeekend) {
                count++;
            }

            currentDate = this.dayjs(currentDate).add(1, 'day');
        }

        return count;
    }
}

module.exports = WorkingDaysCalculator;
