import { getSortedByDate } from "../utils/getSortedByDate";
import { isInEntry } from "../utils/isInEntry";
import { getNumbers } from "./../utils/getNumbers";

const checkStrictItemFromIndex = (data, item, startIndex, weeksCount) => {
    const strictConsecutiveFreqList = {};

    for (let i = startIndex; i < data.length && i - startIndex < weeksCount; i += 1) {
        if (isInEntry(item, data[i])) {
            strictConsecutiveFreqList[i - startIndex] = 1;
        } else { // done
            i += 100;
        }
    }

    return strictConsecutiveFreqList;
}

const checkNonStrictItemFromIndex = (data, item, startIndex, weeksCount) => {
    const nonStrictConsecutiveFreqList = {};

    for (let i = startIndex; i < data.length && i - startIndex < weeksCount; i += 1) {
        nonStrictConsecutiveFreqList[i - startIndex] = isInEntry(item, data[i]) ? 1 : 0;
    }

    return nonStrictConsecutiveFreqList;
}

const mergeFreqResult = (freqList, consecutiveFreqList) => {
    Object.keys(consecutiveFreqList).forEach(key => {
        if (consecutiveFreqList[key] > 0) {
            if (!freqList[parseInt(key) + 1]) {
                freqList[parseInt(key) + 1] = 0;
            }

            freqList[parseInt(key) + 1] += consecutiveFreqList[key];
        }
    });

    return freqList;
}

export const consecutiveFrequency = (data, weeksCount, isStrict) => {
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
                const consecutiveFreqList = isStrict ? checkStrictItemFromIndex(sortedData, item, i + 1, weeksCount) : checkNonStrictItemFromIndex(sortedData, item, i + 1, weeksCount);
                freqList = mergeFreqResult(freqList, consecutiveFreqList);

                i += weeksCount + 1;
            }
        }

        list.push({
            number: item,
            ...freqList
        });
    });


    return list;
}
