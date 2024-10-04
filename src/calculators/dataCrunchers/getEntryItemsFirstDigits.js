import { getItemsInEntries } from "../../utils/getItemsInEntries";
import { getSortedByDate } from "../../utils/getSortedByDate";

export const getEntryItemsFirstDigits = (data, useSupplemental) => {
    const dataSortedDesc = getSortedByDate(data, false);
    const entryItemsFirstDigitsData = [];

    dataSortedDesc.forEach((entry) => {
        const breakoutByFirstDigit = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0
        };
        const entryItems = getItemsInEntries([entry], useSupplemental);

        entryItems.forEach(item => {
            const firstDigit = Math.floor(item / 10);

            breakoutByFirstDigit[firstDigit] += 1;
        })

        entryItemsFirstDigitsData.push({
            "Entry": JSON.stringify(entry),
            "1-9": breakoutByFirstDigit[0],
            "10-19": breakoutByFirstDigit[1],
            "20-29": breakoutByFirstDigit[2],
            "30-39": breakoutByFirstDigit[3],
            "40-47": breakoutByFirstDigit[4]
        })
    })

    return entryItemsFirstDigitsData;
}