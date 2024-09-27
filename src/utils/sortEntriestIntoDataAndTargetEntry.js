
import { isSameDay } from "date-fns";
import _ from "lodash";
import { getSortedByDate, toGameDate } from "./getSortedByDate"

export const getLastEntryDateIndex = ({
    data,
    lastEntryDate,
}) => {
    const sortedDesc = getSortedByDate(data, false);
    const _lastEntryDate = toGameDate(lastEntryDate);
    const lastEntryDateIndex = _.findIndex(sortedDesc, (entry) => {
        const date = toGameDate(entry.Date);
        return isSameDay(date, _lastEntryDate);
    });

    return lastEntryDateIndex
}

/**
 * Break all data entries into:
 * 1. group used for stats and providing suggestions. This group includes lastEntriesCount entries from lastEntryDate and older.
 * 2. target entry. This is the first entry that chri=onologically comes after the lastEntryDate.
 * 
 * @param {*} param0 
 */
export const sortEntriestIntoDataAndTargetEntry = ({
    data,
    lastEntriesCount,
    lastEntryDate,
}) => {
    const sortedDesc = getSortedByDate(data, false);
    const lastEntryDateIndex = getLastEntryDateIndex({
        data,
        lastEntryDate,
    });

    if (lastEntryDateIndex < 0) {
        return {
            targetEntry: null,
            dataGroup: []
        }
    }

    return {
        targetEntry: lastEntryDateIndex > 0 ? sortedDesc[lastEntryDateIndex - 1] : null,
        dataGroup: sortedDesc.slice(lastEntryDateIndex, lastEntryDateIndex + lastEntriesCount)
    }
}