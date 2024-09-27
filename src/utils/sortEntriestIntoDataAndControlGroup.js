
import { isBefore, isSameDay } from "date-fns";
import { getSortedByDate, toGameDate } from "./getSortedByDate"

/**
 * Break all data entries into:
 * 1. group used for stats and providing suggestions. This group includes lastEntriesCount entries from lastEntryDate and older.
 * 2. control entry. This is the first entry after lastEntryDate - the target entry.
 * 
 * @param {*} param0 
 */
export const sortEntriestIntoDataAndControlGroup = ({
    data,
    lastEntriesCount,
    lastEntryDate,
}) => {
    const sortedDesc = getSortedByDate(data, false);
    const dataGroup = [];
    let targetEntry = null;
    const _lastEntryDate = toGameDate(lastEntryDate);
    let startIndex

    for (let i = 0; i < sortedDesc.length; i += 1) {
        const date = toGameDate(sortedDesc[i].Date);
        if (isSameDay(date, _lastEntryDate) ) {
            if (i > 0) {
                targetEntry = sortedDesc[i - 1];
            }
            
            startIndex = i;
            dataGroup.push(sortedDesc[i]);
        }

        if (isBefore(date, _lastEntryDate) && i - startIndex < lastEntriesCount) {
            dataGroup.push(sortedDesc[i])
        }
    }

    return {
        targetEntry,
        dataGroup
    }
}