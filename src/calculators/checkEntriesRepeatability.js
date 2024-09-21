import { getSortedByDate } from "../utils/getSortedByDate";
import { isInEntry } from "../utils/isInEntry";
import { isItem } from "../utils/isItem";

const checkEntry = (originalEntry, anotherEntry) => {
    let repeatingNumbersCount = 0;

    Object.keys(originalEntry).forEach(key => {
        if (isItem(key) && isInEntry(originalEntry[key], anotherEntry)) {
            repeatingNumbersCount += 1;
        }
    })

    return repeatingNumbersCount;
}

export const checkEntriesRepeatability = (data, weeksCount) => {
    const sortedData = getSortedByDate(data, false);

    const list = [];

    for (let i = 0; i < sortedData.length; i += 1) {
        const entry = sortedData[i];
        const entryRepeatability = {
            Date: entry.Date
        };

        [...Array(weeksCount).keys()].forEach(key => {
            entryRepeatability[parseInt(key) + 1] = 0;
        });

        for (let k = 1; k < weeksCount + 1 && i + k < sortedData.length; k += 1) {
            entryRepeatability[k] = checkEntry(entry, sortedData[i + k]);
        }

        list.push(entryRepeatability);
    }


    return list
}