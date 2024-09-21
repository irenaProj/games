import { getSortedByDate } from "../utils/getSortedByDate";
import { isInEntry } from "../utils/isInEntry";
import { mergeFreqResult } from "../utils/mergeFreqResult";
import { getNumbers } from "./../utils/getNumbers";

const checkGapsFromIndex = (data, item, startIndex, weeksCount) => {
    const gapFreqList = {};

    [...Array(weeksCount).keys()].forEach(key => {
        gapFreqList[parseInt(key)] = 0;
    });

    for (let i = 0; i < weeksCount && startIndex + i + 1 < data.length; i += 1) {
        const entry = data[startIndex + i + 1];

        if (isInEntry(item, entry)) {
            gapFreqList[i] += 1;
        } 
    }

    return gapFreqList;
}


/**
 * freq 1 to 5 - represent weeks of gap
 * 
 * @param {*} data 
 * @param {*} weeksCount 
 * @returns 
 */
export const checkGapFrequency = (data, weeksCount) => {
    const items = getNumbers();
    const sortedData = getSortedByDate(data, true);

    const list = [];

    items.map(item => {
        let freqList = {};

        [...Array(weeksCount).keys()].forEach(key => {
            freqList[parseInt(key) + 1] = 0;
        });

        for (let i = 0; i < sortedData.length; i += 1) {
            if (isInEntry(item, sortedData[i])) {
                const gapFreqList = checkGapsFromIndex(sortedData, item, i, weeksCount - 1);
                freqList = mergeFreqResult(freqList, gapFreqList);

                i += 1;
            }
        }

        list.push({
            number: item,
            ...freqList
        });
    });


    return list;
}
