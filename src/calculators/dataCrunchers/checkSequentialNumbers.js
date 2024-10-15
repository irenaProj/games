import { getItemsInEntries } from "../../utils/getItemsInEntries";

export const checkSequentialNumbers = (data, useSupplemental) => {
    const coupleSequentialNumbers = [];
    const trippleSequentialNumbers = [];

    data.forEach((entry) => {
        const entryItems = getItemsInEntries([entry], useSupplemental).sort((i1, i2) => i1 - i2);

        for (let i = 0; i < entryItems.length;) {
            if (i + 2 < entryItems.length && entryItems[i + 1] === entryItems[i] + 1 && entryItems[i + 2] === entryItems[i + 1] + 1) {
                trippleSequentialNumbers.push({
                    items: [entryItems[i], entryItems[i + 1], entryItems[i + 2]],
                    entry: JSON.stringify(entry)
                })
                i += 3;
            } else if (i + 1 < entryItems.length && entryItems[i + 1] === entryItems[i] + 1) {
                coupleSequentialNumbers.push({
                    items: [entryItems[i], entryItems[i + 1]],
                    entry: JSON.stringify(entry)
                })
                i += 2;
            } else {
                i += 1;
            }
        }
    })

    return {
        coupleSequentialNumbers,
        trippleSequentialNumbers
    };
}