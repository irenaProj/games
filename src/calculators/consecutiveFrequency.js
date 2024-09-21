import {getSortedByDate} from "../utils/getSortedByDate";
import {isInEntry} from "../utils/isInEntry";
import {getNumbers} from "./../utils/getNumbers";

const checkItemFromIndex = (data, item, startIndex, weeksCount) => {
    const runningFreqList = {};

    for (let i = startIndex; i < data.length && i - startIndex < weeksCount; i += 1) {
        if (isInEntry(item, data[i])) {
            runningFreqList[i - startIndex ] = 1;
        } else { // done
            i += 100;
        }

        // runningFreqList[i - startIndex ] = isInEntry(item, data[i]) ? 1 : 0;
    }

    console.log(`item=${item}; startIndex=${startIndex}; runningFreqList=${
        JSON.stringify(runningFreqList)
    }`);

    return runningFreqList;
}

const mergeFreqResult = (freqList, runningFreqList) => {
    Object.keys(runningFreqList).forEach(key => {
        if (runningFreqList[key] > 0) {
            if (!freqList[key]) {
                freqList[key] = 0;
            }

            freqList[key] += runningFreqList[key];
        }
    });

    return freqList;
}

export const consecutiveFrequency = (data, weeksCount = 5) => {
    const items = getNumbers();
    const sortedData = getSortedByDate(data, false);

    const list = [];

    items.map(item => {
        let freqList = {};

        [...Array(weeksCount).keys()].forEach(i => {
            freqList[i] = 0;
        });

        for (let i = 0; i < sortedData.length; i += 1) {
            if (isInEntry(item, sortedData[i])) {
                const runningFreqList = checkItemFromIndex(sortedData, item, i + 1, weeksCount);
                freqList = mergeFreqResult(freqList, runningFreqList);

                i += weeksCount + 1;
                console.log(`item=${item}; i=${i}; freqList=${
                    JSON.stringify(freqList)
                }`);
            }
        }

        list.push({
            number: item,
            ... freqList
        });
    });


    return list;
}
