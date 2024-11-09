import { getNumbers } from "../../utils/getNumbers";
import { getItemsInEntries } from "../../utils/getItemsInEntries";
import { getSortedByDate } from "../../utils/getSortedByDate";

export const checkDiffBetweenFirstAndLastItems = (data, useSupplemental, gameItemsCount) => {
    const dataSortedDesc = getSortedByDate(data, false);
    const diffBetweenFirstAndLastItems = {};

    getNumbers(gameItemsCount).forEach(diff => {
        diffBetweenFirstAndLastItems[diff] = 0;
    })

    dataSortedDesc.forEach((entry) => {
        const entryItems = getItemsInEntries([entry], useSupplemental);
        const diff = entryItems[entryItems.length - 1] - entryItems[0];

        diffBetweenFirstAndLastItems[diff] += 1;
    })

    const result = Object.keys(diffBetweenFirstAndLastItems).map((diff) => ({
        difference:diff,
        frequency: diffBetweenFirstAndLastItems[diff]
    })).sort((r1, r2) => r2.difference - r1.difference)

    return result;
}