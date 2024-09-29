import { getItemsInEntries } from "../utils/getItemsInEntries";
import { getSortedByDate } from "../utils/getSortedByDate";

// See
export const getItemsStandardDeviation = ({ data, items, settings: {useSupplemental, gameItemsCount }}) => {
    const sortedData = getSortedByDate(data, true);
    const standardDeviationData = [];
    const runningDataMap = {};

    sortedData.forEach((entry, index) => {
        const entryItems = getItemsInEntries([entry], useSupplemental);

        entryItems.forEach(item => {
            if (!runningDataMap[item]) {
                runningDataMap[item] = {
                    expectedValue: 0,
                    probabilityInEntry: 1
                };
            }

            runningDataMap[item].probabilityInEntry *= 1 /  gameItemsCount;
            // runningDataMap[item].expectedValue += 
        })
    })

    return standardDeviationData;
}