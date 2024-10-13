import { getSortedByDate } from "./getSortedByDate"

// const MAX_DISTANCE_TO_LAST_DATA_ENTRY = 50;

export const getDataDates = (data) => {
    if (!data || !data.length) {
        return []
    }

    const dates = []

    getSortedByDate(data, false).forEach((entry, index) => {
        // if (index < MAX_DISTANCE_TO_LAST_DATA_ENTRY) {
        dates.push(entry.Date)
        // }
    })

    return dates;
}